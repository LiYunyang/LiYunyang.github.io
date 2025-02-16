let pub_json = null;

$.ajax({
    // url: 'doc/pub.yaml',
    url: 'scripts/pub.yaml',
    async: false,
    dataType: 'text',
    success: function (yaml) {
        pub_json = jsyaml.load(yaml);
    },
    error: function () {
        console.log('error');
    }
});



window.onpageshow = function () {
    // renderPubList(pub_json['first-author'], $('.first-author')[0]);
    // renderPubList(pub_json['contrib-author'], $('.co-author')[0]);

    renderPubListNew(pub_json['main-author'], $('.first-author')[0]);
    renderPubListNew(pub_json['contrib-author'], $('.co-author')[0]);
};

function renderPubList(json_item, block){
    while (block.firstChild) {
        block.removeChild(block.firstChild);
    }
    json_item.forEach(function (_, ){
        // console.log(_)
        let item = document.createElement('div');
        item.className = "pub-item";

        let info = document.createElement('div');
        info.className = "pub-info";

        let code = document.createElement('code');
        code.innerHTML = _.year;
        info.appendChild(code);

        let journal_a = document.createElement('a');
        journal_a.href = _.journal_ref;
        journal_a.target = "_blank";
        journal_a.title = "journal version";
        journal_a.classList.add("hover");
        _.journal_code.split(' ').forEach(function (x){
            journal_a.innerHTML += `<span>${x}</span>`
        })
        info.appendChild(journal_a);
        item.appendChild(info);

        let title = document.createElement('div');
        title.className = "pub-title";

        let loc_a = document.createElement('a');
        loc_a.href = _.local_ref;
        loc_a.target = "_blank";
        loc_a.title = "pdf version";
        loc_a.innerHTML = _.title;
        title.appendChild(loc_a);
        let aut = document.createElement('span');
        aut.innerHTML = _.authors;
        title.appendChild(aut);

        item.appendChild(title);
        block.appendChild(item);
    })

}


function join_authors(authors){
    var hasExactMatch = authors.includes('YL');
    if (!hasExactMatch && authors.length > 0) {
        authors[authors.length - 1] = `<b>${authors[authors.length - 1]}</b>`;
    }

    var modifiedArray = authors.map(function(item) {
        return item.replace('YL', '<b>Li, Yunyang</b>');
    });

// Concatenate the modified elements into a single string using ";"
    return modifiedArray.length > 1 ? modifiedArray.slice(0, -1).join('; ') + ' & ' + modifiedArray.slice(-1) : modifiedArray[0];
}



function renderPubListNew(json_item, block){
    while (block.firstChild) {
        block.removeChild(block.firstChild);
    }

    json_item.sort(function(a, b) {
    // Convert the date strings to Date objects for comparison
    var dateA = new Date(a.date);
    var dateB = new Date(b.date);

    // Compare the dates
    return dateB-dateA;
});

    json_item.forEach(function (_, ){
        // console.log(_)
        let item= document.createElement('div');
        item.className = "pub-item";

        let info = document.createElement('div');
        info.className = "pub-info";

        let code = document.createElement('code');
        code.innerHTML = _.year;
        info.appendChild(code);

        let journal_a = document.createElement('a');
        journal_a.href = _.url;
        journal_a.target = "_blank";
        journal_a.title = "journal version";
        journal_a.classList.add("hover");
        journal_a.innerHTML = `<span>${_.journal}</span>`
        if (_.issue !== null){
            _.issue.split(',').forEach(function (x){
            journal_a.innerHTML += `<span>${x}</span>`
        })
        }

        info.appendChild(journal_a);
        item.appendChild(info);

        let title = document.createElement('div');
        title.className = "pub-title";

        let loc_a = document.createElement('a');
        loc_a.href = _.pdf_url;
        loc_a.target = "_blank";
        loc_a.title = "pdf version";
        loc_a.innerHTML = _.title;
        title.appendChild(loc_a);
        let aut = document.createElement('span');
        aut.innerHTML = join_authors(_.authors);
        title.appendChild(aut);
        item.appendChild(title);
        block.appendChild(item);
    })

}