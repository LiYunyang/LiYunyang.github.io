let datestatus = null;
let arxiv=null;
let arxiv_kind = Array('CO', 'HE', 'GA', 'IM', 'SR', 'EP');
let keywords = Array('hot gas', 'hot halo', 'missing baryon', 'neutron star', 'pulsar', 'distance ladder',
    'gravitational wave', 'fast radio burst', 'magnetar', 'compact object', 'cosmic microwave background',
    'Hubble Constant', "Hubble Tension", 'cosmology', 'B-mode', 'E-mode', 'polarization', 'inflation', "weak lensing",
    "Sunyaev-Zel'dovich", 'Sunyaev-Zeldovich', "Sunyaev Zel'dovich", "concordance", "neutrino",
    "baryon acoustic oscillations", "BAO", '21 cm', '21-cm', 'dark energy survey', 'dark energy', 'dark matter',
    'primordial', 'first star', 'anomalous microwave emission',  'Planck',
);
let keywords_case = Array('CLASS', 'LIGO', 'WMAP', 'ACT', 'SPT', 'BICEP','AME',  "CMB", "SZ", );

window.onpageshow = function(){
    $("#loading").fadeIn(function () {
        fetch_new().then(end => {$("#loading").hide()})
    });
};

function fetch_new(){
    console.log('start')
    let proxy = "https://cors-anywhere-for-yl.herokuapp.com/";
    let url = "http://export.arxiv.org/list/astro-ph/new";

    return fetch(proxy+url, )
        .then(response => response.text())
        .then(str => new window.DOMParser().parseFromString(str, "text/html"))
        .then(data => render_arxiv(data))
}


function render_arxiv(arxiv) {
    let toggle_box = document.getElementById('at-arxiv-toggle-box');
    for (let i = 0; i < arxiv_kind.length; i++){
        let _ = document.createElement('div');
        _.innerText = arxiv_kind[i];
        _.onclick=function(){collapse_kind(_.innerText)};
        _.style.backgroundColor=getComputedStyle(document.documentElement).getPropertyValue('--color-'+arxiv_kind[i]).replace(/[\d\.]+\)$/g, '0.2)');
        _.id= 'at-' + arxiv_kind[i] + '_toggle';
        _.classList.add('at-arxiv-toggle');
        _.setAttribute("toggled", false);
        toggle_box.appendChild(_);
    }
    toggle_box.style.visibility="visible";
    let new_submission = arxiv.getElementsByTagName('dl')[0];
    let cross_links = arxiv.getElementsByTagName('dl')[1];

    let newdate = new Date(arxiv.getElementsByTagName('h3')[0].innerHTML.match(/for.*/g)[0].slice(4,));
    let crsdate = new Date(arxiv.getElementsByTagName('h3')[1].innerHTML.match(/for.*/g)[0].slice(4,));
    let today = new Date();
    let days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let new_date = document.getElementById("replaceable_new_date");
    let crs_date = document.getElementById("replaceable_crs_date");
    let date_str = days[newdate.getDay()] + ', ' + newdate.getDate() + ', ' + newdate.toLocaleString('default', { month: 'short' });
    if (newdate.getDate() >= today.getDate()){
        new_date.innerHTML = "<img class='shied-img' src=\"https://img.shields.io/badge/new submission-{0}-green.svg\">".replace('{0}', date_str);
        crs_date.innerHTML = "<img class='shied-img' src=\"https://img.shields.io/badge/cross list-{0}-green.svg\">".replace('{0}', date_str);
    }
    else{
        new_date.innerHTML = "<img class='shied-img' src=\"https://img.shields.io/badge/new submission-{0}-red.svg\">".replace('{0}', date_str);
        crs_date.innerHTML = "<img class='shied-img' src=\"https://img.shields.io/badge/cross list-{0}-red.svg\">".replace('{0}', date_str);
    }
    populateArxiv('replaceable-new', new_submission);
    populateArxiv('replaceable-crs', cross_links);
    return true

}

function populateArxiv(arxiv_section, data_dl) {
    let rep_new = document.getElementById(arxiv_section);
    while (rep_new.firstChild) {
        rep_new.removeChild(rep_new.firstChild);
    }
    let dt = data_dl.getElementsByTagName('dt');
    let dd = data_dl.getElementsByTagName('dd');
    let length = dd.length;
    for (let i = 0; i < length; i++){
        let id = dt[i].getElementsByTagName('span')[0].firstChild.innerText.slice(6);

        let item_div = document.createElement('div');
        item_div.className = 'at-item';
        item_div.id = id;
        item_div.setAttribute('collapsed', false);

        let header = document.createElement('div');
        header.className = 'at-header';

        let num = document.createElement('div');
        num.className = 'at-num';
        num.innerHTML=`<span>${(i+1).toString()}/${length}</span>`
        header.appendChild(num);

        let title = document.createElement('div');
        let title_1 = document.createElement('div');
        title.className = 'at-title';
        title_1.className = "at-title-title";

        title_1.onclick = function () {collapse_box(item_div.id)};
        title_1.innerHTML = dd[i].getElementsByClassName('list-title')[0].innerText.slice(7);
        // MathJax.Hub.processSectionDelay = 5;
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, title_1]);
        let title_2 = document.createElement('div');
        title_2.className = "at-title-tags";
        let title_2a = document.createElement('a');
        title_2a.href = "https://arxiv.org/pdf/" + id;
        title_2a.target = "_blank";
        title_2a.title = "pdf";
        title_2a.innerHTML = "<code class='id'>" + id + "</code>";
        title_2a.classList.add('at-tag', 'at-arxiv-tag');
        title_2.appendChild(title_2a);

        let cats = dd[i].getElementsByClassName('list-subjects')[0].innerText.match(/\(.*?\.\S*?\)/g);
        for (let j = 0; j<cats.length; j++){
            let title_2span = document.createElement('span');
            let _cat;
            if(arxiv_kind.includes(cats[j].slice(-3, -1))){_cat = cats[j].slice(-3, -1)}
            else {_cat = cats[j].match(/\..*?\)/g)[0].slice(1, -1)}
            title_2span.className = 'at-subject at_' + _cat;
            title_2span.classList.add('at-tag');
            title_2span.classList.add('no-text-select');
            title_2span.innerHTML = _cat;
            if(arxiv_kind.includes(_cat)){
                title_2span.style.backgroundColor=getComputedStyle(document.documentElement).getPropertyValue('--color-'+_cat)
            }
            else{
                title_2span.style.backgroundColor=getComputedStyle(document.documentElement).getPropertyValue('--color-other')
            }
            title_2.appendChild(title_2span);
            item_div.classList.add('at-arxiv-{0}'.replace('{0}', _cat))
        }
        title.appendChild(title_1);
        title.appendChild(title_2);
        header.appendChild(title);
        //
        let content = document.createElement('div');
        content.className = 'at-content';
        let authors = document.createElement('div');
        authors.className = 'at-authors';
        let all_author = dd[i].getElementsByClassName('list-authors')[0].getElementsByTagName('a');
        for (let j = 0; j<all_author.length; j++){
            let author_a = document.createElement('a');
            author_a.href = 'http://export.arxiv.org/' + all_author[j].getAttribute('href');
            author_a.target = '_blank';
            author_a.innerText = all_author[j].innerText;
            authors.appendChild(author_a);
            if(j>0){author_a.insertAdjacentHTML('beforebegin', '<span>; </span> ');}}
        content.appendChild(authors);
        let abstract = document.createElement('div');
        abstract.className = 'at-abstract mathjax';
        abstract.innerHTML = dd[i].getElementsByTagName('p')[0].innerText;
        let instance = new Mark(abstract);
        instance.mark(keywords, {
            "separateWordSearch": false,
            "accuracy": "exactly",
            "ignorePunctuation": ":;.,-–—‒_(){}[]!'\"+=".split(""),
            "done": function (n) {if(n>0){title_1.classList.add('key_matched')}}
        });
        instance.mark(keywords_case, {
            "separateWordSearch": false,
            "accuracy": "exactly",
            "caseSensitive": true,
            "ignorePunctuation": ":;.,-–—‒_(){}[]!'\"+=".split(""),
            "done": function (n) {if(n>0){title_1.classList.add('key_matched')}}
        });
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, abstract]);
        content.appendChild(abstract);
        item_div.appendChild(header);
        item_div.appendChild(content);
        rep_new.appendChild(item_div);
    }

}

function collapse_box(id) {
    let box = document.getElementById(id);
    let title_bar = box.getElementsByClassName('at-title')[0];
    let to_fold = box.getElementsByClassName('at-content')[0];
    let title = box.getElementsByClassName('at-title-title')[0];
    let abstract = box.getElementsByClassName('at-abstract')[0];
    let _ = box.classList.toggle('partial-collapse')
    console.log(id, box, _)
    // if (!box.collapsed){
    //     title.style.fontSize = parseInt(window.getComputedStyle(title).fontSize.slice(0, -2))*0.8 + 'px';
    //     box.collapsed = true;
    //     to_fold.style.display = "none";
    //     title.style.fontWeight = "lighter";
    //     title.style.cursor="context-menu";
    //     if (abstract.childNodes.length > 0){
    //         for (let i=0; i<abstract.childNodes.length; i++){
    //             if (abstract.childNodes[i].className === "at-highlight"){
    //                 title_bar.style.opacity = "1.0";
    //                 break
    //             }
    //         }
    //     }
    // }
    // else {
    //     title.style.fontSize = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--font-size').slice(0, -2))*1.2 + 'px';
    //     box.collapsed = false;
    //     to_fold.style.display = null;
    //     title.style.fontWeight = null;
    //     title.style.cursor=null;
    // }
}

function collapse_kind(kind) {
    let toggle = document.getElementById('at-{0}_toggle'.replace('{0}', kind));
    if (!toggle.toggled) {
        toggle.toggled = true;
        toggle.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--color-' + kind).replace(/[\d\.]+\)$/g, '0.8)');
    }
    else {
        toggle.toggled = false;
        toggle.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--color-' + kind).replace(/[\d\.]+\)$/g, '0.2)');
    }
    let all_box = document.getElementsByClassName('at-item');
    let box_num = all_box.length;
    let toggled_kinds = Array();
    for (let i = 0; i<arxiv_kind.length; i++){
        if (document.getElementById('at-{0}_toggle'.replace('{0}', arxiv_kind[i])).toggled){
            toggled_kinds.push(arxiv_kind[i])
        }
    }
    let kind_num = toggled_kinds.length;
    if(kind_num===0){
        for (let j = 0; j<box_num; j++) {
            all_box[j].style.display = null;
        }
        return 0;
    }
    for (let j = 0; j<box_num; j++){
        all_box[j].style.display = "none";
        for (let i = 0; i<kind_num; i++){
            if (all_box[j].classList.contains('at-arxiv-'+toggled_kinds[i])){
                all_box[j].style.display = null;
                break
            }
        }
    }


}

function collapseWholeBlock() {
    let t = window.event.target;
    let s = t.nextElementSibling.style;
    if (s.display === "none"){
        t.style.opacity = "1.0";
        t.style.cursor = "grab";
        s.display = null;
    }
    else {
        s.display = "none";
        t.style.opacity = "0.5";
        t.style.cursor = "context-menu";
    }
}

function all_collapseFunction(){
    let target = window.event.target;
    let all_buttons = document.getElementsByClassName('ab_button');
    if (target.className==="fa fas fa-indent") {
        target.className="fa fas fa-minus";
        target.parentNode.title='fold all';
        for (let i = 0; i < all_buttons.length; i ++){
            if (all_buttons[i].firstElementChild.className==="fa fas fa-angle-up"){
                all_buttons[i].firstElementChild.click();
            }
            let abstract = all_buttons[i].parentNode.parentNode.nextElementSibling.lastElementChild;
            if (abstract.childNodes.length > 0){
                for (let j=0; j<abstract.childNodes.length; j++){
                    if (abstract.childNodes[j].className === "at-highlight"){
                        if (all_buttons[i].firstElementChild.className==="fa fas fa-angle-down") {
                            all_buttons[i].firstElementChild.click();
                        }
                    }
                }
            }


        }
    }
    else if (target.className==="fa fas fa-minus") {
        target.className="fa fas fa-bars";
        target.parentNode.title='expand all';
        for (let i = 0; i < all_buttons.length; i ++){
            if (all_buttons[i].firstElementChild.className==="fa fas fa-angle-up"){
                all_buttons[i].firstElementChild.click();
            }
        }
    }
    else if (target.className==="fa fas fa-bars") {
        target.className="fa fas fa-indent";
        target.parentNode.title='smart fold';
        for (let i = 0; i < all_buttons.length; i ++){
            if (all_buttons[i].firstElementChild.className==="fa fas fa-angle-down"){
                all_buttons[i].firstElementChild.click();
            }
        }
    }

}






