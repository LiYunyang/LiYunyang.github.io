function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function get_image_title(callback) {
    // Assuming 'data.yaml' is in the same directory as your HTML file
    fetch('images/cover/info.yaml')
        .then(response => response.text())
        .then(data => {
            const parsedData = jsyaml.load(data);

            if (!Array.isArray(parsedData) || parsedData.length === 0) {
                console.error('Invalid YAML format or empty array.');
                callback(['', '', '']);
                return;
            }

            const rdm = getRandomInt(0, parsedData.length - 1);
            const image = `url('${parsedData[rdm].image}')`;
            const title_a = parsedData[rdm].title_a;
            const title_b = parsedData[rdm].title_b || '';

            callback([image, title_a, title_b + '\n' + title_a]);
        })
        .catch(error => {
            console.error('Error reading YAML file:', error.message);
            callback(['', '', '']);
        });
}


function get_header(html){
    let header = document.createElement('div')
    header.classList.add('no-text-select')
    let header_frame =  document.createElement('div')
    header_frame.id='header-title-frame'
    let title_box =  document.createElement('div')
    title_box.id='title-box'
    switch (html) {
        case 'Vitae':
            title_box.innerHTML=`
                <h1>VITAE</h1>
                <p style="visibility: hidden"> My name is Yunyang. I am an astrophysicist.</p>
            `
            break;
        case 'Research':
            title_box.innerHTML=`
                <h1>RESEARCH</h1>
                <p style="visibility: hidden;">Astrophysicist, like a normal physicist, except much cooler.</p>
            `
            break;
        case 'Publications':
            title_box.innerHTML=`
                <h1>PUBLICATIONS</h1>
                <p style="visibility: hidden">Department of Physics and Astronomy, Johns Hopkins University</p>
            `
            break;
        case 'Astrotoday':
            title_box.innerHTML=`
                <h1 >ASTRO TODAY</h1>
                <p>Latest listings on astro-ph</p>
            `
            break;
        case 'Links':
            title_box.innerHTML=`
                <h1>LINKS</h1>
                <p style="visibility: hidden">Department of Physics and Astronomy, Johns Hopkins University</p>
            `
            break;
    }
    header_frame.appendChild(title_box)
    let header_bars =  document.createElement('div')
    header_bars.id='header-menu-bars'
    header_bars.innerHTML=`
        <div class="menu-bar-box"><a href="."> HOME </a></div>
        <div class="menu-bar-box"><a href="Vitae.html"> VITAE </a></div>
        <div class="menu-bar-box"><a href="Research.html">RESEARCH</a></div>
        <div class="menu-bar-box"><a href="Publications.html">PUBLICATIONS</a></div>
        <div class="menu-bar-box"><a href="Astrotoday.html">ASTROTODAY</a></div>
        <div class="menu-bar-box"><a href="Links.html">LINKS</a></div>
    `
    header.appendChild(header_frame)
    header.appendChild(header_bars)
    let body = $('body')[0]
    body.insertBefore(header, body.childNodes[0])
    header.id = 'header'
    get_image_title(image_title => {
        document.body.style.backgroundImage = image_title[0]
        header_frame.title = image_title[1]
    })

}

function get_footer(){
    let footer = document.createElement('div')
    footer.id='footer'
    footer.classList.add('no-text-select')
    let date = new Date()
    let yy = date.getFullYear()
    let last_modified = new Date(document.lastModified).toLocaleDateString()
    footer.innerHTML=`
    <div class="powr-hit-counter" id="115c58eb_1591679431"></div><script src="https://www.powr.io/powr.js?platform=html"></script>
    
    <div class="copyright">
        <svg
   version="1.1"
   id="Capa_1"
   x="0px"
   y="0px"
   viewBox="0 0 64 64"
   xml:space="preserve"
   width="64"
   height="64"
   class=""
   sodipodi:docname="download.svg"
   inkscape:version="1.2.2 (b0a84865, 2022-12-01)"
   xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
   xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:svg="http://www.w3.org/2000/svg"><defs
   id="defs2420" /><sodipodi:namedview
   id="namedview2418"
   pagecolor="#ffffff"
   bordercolor="#000000"
   borderopacity="0.25"
   inkscape:showpageshadow="2"
   inkscape:pageopacity="0.0"
   inkscape:pagecheckerboard="0"
   inkscape:deskcolor="#d1d1d1"
   showgrid="false"
   inkscape:zoom="2.9281825"
   inkscape:cx="47.12821"
   inkscape:cy="36.029175"
   inkscape:window-width="1309"
   inkscape:window-height="617"
   inkscape:window-x="96"
   inkscape:window-y="1537"
   inkscape:window-maximized="0"
   inkscape:current-layer="Capa_1" /><g
   id="g2415"
   transform="matrix(0.1250701,0,0,0.12435079,0,0.4107791)"
   style="fill-opacity:1"><g
     id="g2413"
     style="fill-opacity:1">
\t<g
   id="g2411"
   style="fill-opacity:1">
\t\t<path
   d="M 437.02,74.981 C 388.667,26.629 324.38,0 256.001,0 187.62,0 123.333,26.629 74.98,74.981 26.629,123.333 0,187.62 0,255.999 c 0,68.381 26.629,132.668 74.98,181.02 48.353,48.353 112.64,74.98 181.021,74.98 68.379,0 132.666,-26.628 181.018,-74.98 C 485.372,388.667 512,324.38 512,255.999 512.001,187.62 485.372,123.333 437.02,74.981 Z M 379.532,310.209 C 357.954,359.592 309.196,391.5 255.315,391.5 180.599,391.5 119.814,330.715 119.814,256 c 0,-74.715 60.785,-135.5 135.501,-135.5 53.572,0 102.217,31.654 123.928,80.642 3.357,7.573 -0.063,16.435 -7.636,19.791 -7.573,3.356 -16.435,-0.063 -19.791,-7.636 C 334.909,175.15 297.03,150.5 255.315,150.5 c -58.174,0 -105.501,47.327 -105.501,105.5 0,58.174 47.327,105.5 105.501,105.5 41.956,0 79.924,-24.848 96.727,-63.303 3.317,-7.592 12.16,-11.058 19.752,-7.74 7.591,3.317 11.056,12.16 7.738,19.752 z"
   data-original="#000000"
   class="active-path"
   style="fill-opacity:1"
   data-old_color="#000000"
   id="path2409" />
\t</g>
</g></g> </svg>        
        <span>${yy}</span>
    </div>
    <div id="signature">
        <span>YUNYANG LI</span>
        <span>|</span>
        <span>JOHNS HOPKINS UNIVERSITY</span>
    </div>
    <div id="last-edit"><span>Last edit: ${last_modified}</span></div>
    `
    $('body')[0].appendChild(footer)
}

function insert_stats_tracker(){
    // Create a new script element
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
        return;
    }

    let statCounterCode = `<!-- Default Statcounter code for Yunyang@JHUhttps://liyunyang.github.io/ -->
        <script type="text/javascript">
            var sc_project=11775224; 
            var sc_invisible=0; 
            var sc_security="b5b94723"; 
            var scJsHost = "https://";
            document.write("<sc"+"ript type='text/javascript' src='" + scJsHost+"statcounter.com/counter/counter.js'></"+"script>");
        </script>
       <!-- End of Statcounter Code -->`
    document.body.insertAdjacentHTML('beforeend', statCounterCode);

    // Manually create and append the noscript content
    let noscriptElement = document.createElement("noscript");

    let div = document.createElement("div");
    div.className = "statcounter";

    let a = document.createElement("a");
    a.title = "Web Analytics";
    a.href = "https://statcounter.com/";
    a.target = "_blank";

    let img = document.createElement("img");
    img.className = "statcounter";
    img.src = "https://c.statcounter.com/11775224/0/b5b94723/0/";
    img.alt = "Web Analytics";
    img.referrerPolicy = "no-referrer-when-downgrade";

    a.appendChild(img);
    div.appendChild(a);
    noscriptElement.appendChild(div);
    document.body.appendChild(noscriptElement);
}



document.addEventListener('DOMContentLoaded', function() {
    let html = window.location.pathname.split("/").pop().split('.')[0]
    if(Array('Vitae', 'Research', 'Publications', 'Astrotoday', 'Links').includes(html)){
        get_header(html)
    }
    get_footer();
    insert_stats_tracker();
});