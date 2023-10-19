let pub_json = null;

$.ajax({
    url: 'doc/pub.yaml',
    async: false,
    dataType: 'text',
    success: function (yaml) {
        // Object.assign(pub_json, jsyaml.load(yaml));
        pub_json = jsyaml.load(yaml);
    },
    error: function () {
        console.log('error');
    }
});



window.onpageshow = function () {
    renderPubList(pub_json.firstauthor, $('.first-author')[0]);
    renderPubList(pub_json.coauthor, $('.second-author')[0]);
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