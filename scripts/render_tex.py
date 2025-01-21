import yaml
from jinja2 import Template
import html
import numpy as np

def join_authors(authors):
    has_exact_match = 'YL' in authors

    if not has_exact_match and authors:
        authors[-1] = r'\textbf{' + authors[-1] + '}'

    modified_list = [item.replace('YL', r'\textbf{YL}') for item in authors]
    if len(modified_list) > 1:
        result = '; '.join(modified_list[:-1]) + r' \& ' + modified_list[-1]
    else: 
        result = modified_list[0]

    return result


def render_section(name, pub_list):
    template_str = r"""\begin{footnotesize}
    \textsf{\textbf{ {{ name }} }}
\end{footnotesize}
\begin{etaremune}[topsep=0pt,itemsep=0pt,partopsep=0pt,parsep=0pt]
    \renewcommand\labelenumi{\footnotesize\bfseries\theenumi.}
    {% for pub in pub_list %}
    \pubitem{ {{-pub.url-}} }
            { {{-pub.title-}} }
            { {{-f1(pub.authors)-}} }
            { {{-pub.journal}} {{f2(pub)}} ({{-pub.year-}})}
    {% endfor %}
\end{etaremune}

"""
    template = Template(template_str)
    def f2(d):
        if d['journal']=='arXiv':
            return d['arxiv']
        else:
            return ', '.join(d['issue'].split(','))
    return html.unescape(template.render(name=name, pub_list=pub_list, f1=join_authors, f2=f2,
                                         trim_blocks=True, lstrip_blocks=True))


def get_stats(pub_dict):
    n_cite = [_['citation'] for d in pub_dict.values() for _ in d]
    n_cite.sort(reverse=True)
    h_index = next((h for h, count in enumerate(n_cite, start=1) if count < h), len(n_cite) + 1) - 1
    return h_index, sum(n_cite)

def render_citation(pub_list):
    h_index, total = get_stats(pub_dict)
    template = Template(r"""\hfill\textmd{h-index: {{ h_index-}}, citations: {{total-}} }

""")
    return html.unescape(template.render(h_index=h_index, total=total))
    
with open('pub.yaml', 'r') as f:
    pub_dict = yaml.load(f, Loader=yaml.FullLoader)



#Output or save the LaTeX code to a file
with open("output.tex", "w") as f:
    f.write(render_citation(pub_dict))
    f.write(render_section("AS FIRST AUTHOR", pub_dict['first-author']))
    f.write(render_section("AS CONTRIBUTING COAUTHOR", pub_dict['contrib-author']))
    f.write(render_section("REVIEW/ADVISORY CONTRIBUTION", pub_dict['advisory-author']))
