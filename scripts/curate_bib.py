import requests
import yaml
import json
import re 
import shutil
import os
from datetime import datetime

ads_api_key = 'KGN8XH9gR0yBKrqq0ErccGMnYomNlszLoFAAy6kn'
library_id = 'oQSmjgZfSFiKlqPXclOhUg'
ads_api_url = f'https://api.adsabs.harvard.edu/v1/biblib/libraries/{library_id}?rows=100'
headers = {'Authorization': f'Bearer {ads_api_key}'}

my_name = ['Li, Yunyang', 'Li, Y.', 'Li, Y.-Y.', 'Li, Yun-Yang']
max_author_num = 5

def format_author_list(author_list_raw):
    """format the author list """
    author_list = []
    has_my_name = False
    for i, _ in enumerate(author_list_raw):
        if _ == '&amp':
            continue
        if _ in my_name:
            author_list.append('YL')
            has_my_name = True
        else:
            author_list.append(_)
    if not has_my_name:
        raise ValueError(f"Missing my name in {author_list_raw}")
    return author_list
    
def fetch_from_ads():
    response = requests.get(ads_api_url, headers=headers)
    if response.status_code == 200:
        api_data = response.json()
        print("BibTeX data saved successfully.")
        payload = {
            "format":'%ZEncoding:html%ZAuthorSep:"; "[TITLE:%T][AUTHORS:%A][YEAR:%Y][JOURNAL:%q][ISSUE:%V,%p][URL:%u][DOI:%d][%X][DATE:%Y/%D][BIBCODE:%R][CITATION:%c]',
            "bibcode": api_data['documents'],
            "sort": "date desc"}
        results = requests.post("https://api.adsabs.harvard.edu/v1/export/custom",
                                headers=headers,
                                data=json.dumps(payload))
    else:
        raise IOError(f"Failed to fetch library data. Status code: {response.status_code}")
    
    entries_string = results.json()['export'].strip()
    entries_list = entries_string.split('\n')

    # Parse each entry and create a list of dictionaries
    yaml_list = []
    for entry in entries_list:
        # Remove brackets and split key-value pairs
        pairs = entry.strip('[]').split('][')

        # Create a dictionary for each key-value pair
        entry_dict = {}
        for pair in pairs:
            key, val = pair.split(':', 1)
            key = key.strip().lower()
            if key == 'authors':
                entry_dict[key] = format_author_list(re.split('; and |; | and ', val.strip()))
            elif key in ('year', 'citation'):
                entry_dict[key] = int(val.strip())
            elif key=='date':
                entry_dict[key] = '/'.join(val.split('/')[:2])
            elif key=='issue':
                if entry_dict.get('journal', None) == 'arXiv':
                    entry_dict[key] = None
                else:
                    entry_dict[key] = str(val.strip())
            else:
                entry_dict[key] = val.strip()
        if entry_dict.get('journal', None) == 'arXiv':
            entry_dict['pdf_url'] = f'https://arxiv.org/pdf/{entry_dict["arxiv"]}.pdf'
        else:
            entry_dict['pdf_url'] = f'https://ui.adsabs.harvard.edu/link_gateway/{entry_dict["bibcode"]}/PUB_PDF'
        yaml_list.append(entry_dict)

        # Convert the list of dictionaries to YAML
    return yaml_list


def open_current_list():
    with open('pub.yaml', 'r') as f:
        cur_list = yaml.load(f, Loader=yaml.FullLoader)
    return cur_list

def compare_two_entry(a, b):
    if a.get('arxiv', 'True') == b.get('arxiv', 'False'):
        return True
    elif a.get('doi', 'True') == b.get('doi', 'False'):
        return True
    else:
        return False

def auto_categorize(a):
    if 'YL' not in a['authors']:
        return "unknown"
    else:
        index = a['authors'].index('YL')
        if index < 2:
            return "main-author"
        else:
          for _ in a['authors'][index+1:]:
              if _.split(',')[0] < 'Li':
                  return "main-author"
          else:
              return "contrib-author"


def update_pub_list():
    raw_list = fetch_from_ads()
    cur_list = open_current_list()
    new_list = {k: [] for k in cur_list.keys()}
    for entry in raw_list:
        if entry.get('journal', None) == 'SPIE':
            entry['issue'] = entry['issue'].split(',')[1].strip(' ')
        matched=False
        for k, v in cur_list.items():
            for _v in v:
                if compare_two_entry(entry, _v):
                    # new_list[k].append(_v)
                    entry['authors'] = _v['authors']
                    new_list[k].append(entry)
                    matched = True
        if not matched:
            new_list[auto_categorize(entry)].append(entry)
    
    shutil.copy("pub.yaml", "pub_old.yaml")
    yaml_output = yaml.dump(new_list, default_flow_style=None, indent=4, width=float('inf'), sort_keys=False)
    
    # Indent entire lists in the YAML structure
    indented_yaml = ""
    indent_next_line = False
    for line in yaml_output.splitlines():
        if line.strip().startswith("- "):
            indented_yaml += " "*4 + line + "\n"
        elif line.startswith(" "):
            indented_yaml += " "*4 + line + "\n"
        else:
            indented_yaml += line + "\n"
    # Save the new YAML file with selective indentation for lists
    with open("pub.yaml", "w") as new_yaml_file:
        new_yaml_file.write(indented_yaml)

    
    return new_list

def touch():
    current_date = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    new_comment = f'Updated on {current_date}'
    script_dir = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(script_dir, '../Publications.html')
    if os.path.exists(file_path):
        with open(file_path, 'r') as file:
            lines = file.readlines()

        # Find and update the last commented line
        with open(file_path, 'w') as file:
            found = False
            for i in range(len(lines) - 1, -1, -1):
                if lines[i].strip().startswith('<!--'):
                    last_comment_index = i
                    found = True
                    break

            # Update the last comment line
            if found:
                # Ensure comment is closed properly
                if lines[last_comment_index].strip().endswith('-->'):
                    lines[last_comment_index] = f'<!-- {new_comment} -->\n'
                else:
                    # Add the closing tag if missing
                    lines[last_comment_index] = f'<!-- {new_comment} -->\n'
            else:
                # If no comments are found, add a new comment
                lines.append(f'<!-- {new_comment} -->\n')

            file.writelines(lines)
    else:
        print(f"File {file_path} does not exist.")

if __name__ == "__main__":
    new_list = update_pub_list()
    # print(new_list)
    touch()
    