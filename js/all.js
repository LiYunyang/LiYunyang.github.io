window.onload = function () {
    let html = window.location.pathname.split("/").pop().split('.')[0]
    console.log(html)
    if(Array('Vitae', 'Research', 'Publications', 'Astrotoday', 'Links').includes(html)){get_header(html)}
    get_footer()
};

function get_image_title(){
    let rdm = Math.floor(Math.random()*10) + 1;
    let image;
    let title_a;
    let title_b;
    switch (rdm){
        case 1:
            image = "url('images/cover/jupiter.jpg')";
            title_a = 'Credit: NASA-Juno mission.';
            // title_b = 'See Jupiter’s southern hemisphere in beautiful detail in this new image taken by NASA’s Juno spacecraft. The color-enhanced view captures one of the white ovals in the “String of Pearls,” one of eight massive rotating storms at 40 degrees south latitude on the gas giant planet. The image was taken on Oct. 24, 2017 at 11:11 a.m. PDT (2:11 p.m. EDT), as Juno performed its ninth close flyby of Jupiter. At the time the image was taken, the spacecraft was 20,577 miles (33,115 kilometers) from the tops of the clouds of the planet at a latitude of minus 52.96 degrees. The spatial scale in this image is 13.86 miles/pixel (22.3 kilometers/pixel).';
            title_b = '';
            break;
        case 2:
            image = "url('/images/cover/PerX.jpg')";
            title_a = 'Credit: NASA-APOD. The Perseus Cluster Waves.';
            // title_b =  'The cosmic swirl and slosh of giant waves in an enormous reservoir of glowing hot gas are traced in this enhanced X-ray image from the Chandra Observatory. The frame spans over 1 million light-years across the center of the nearby Perseus Galaxy Cluster, some 240 million light-years distant. Like other clusters of galaxies, most of the observable mass in the Perseus cluster is in the form of the cluster-filling gas. With temperatures in the tens of millions of degrees, the gas glows brightly in X-rays. Computer simulations can reproduce details of the structures sloshing through the Perseus cluster’s X-ray hot gas, including the remarkable concave bay seen below and left of center. About 200,000 light-years across, twice the size of the Milky Way, the bay’s formation indicates that Perseus itself was likely grazed by a smaller galaxy cluster billions of years ago.';
            title_b = '';
            break;
        case 3:
            image = "url('/yli311/images/cover/M20M21.jpg')";
            title_a = 'Credit: NASA-APOD. Composite Messier 20 and 21.';
            // title_b = 'The beautiful Trifid Nebula, also known as Messier 20, lies about 5,000 light-years away, a colorful study in cosmic contrasts. It shares this nearly 1 degree wide field with open star cluster Messier 21 (top left). Trisected by dust lanes the Trifid itself is about 40 light-years across and a mere 300,000 years old. That makes it one of the youngest star forming regions in our sky, with newborn and embryonic stars embedded in its natal dust and gas clouds. Estimates of the distance to open star cluster M21 are similar to M20’s, but though they share this gorgeous telescopic skyscape there is no apparent connection between the two. M21’s stars are much older, about 8 million years old. M20 and M21 are easy to find with even a small telescope in the nebula rich constellation Sagittarius. In fact, this well-composed scene is a composite from two different telescopes. Using narrowband data it blends a high resolution image of M20 with a wider field image extending to M21.';
            title_b = '';
            break;
        case 4:
            image = "url('/yli311/images/cover/DarkMatter.jpg')";
            title_a = 'Credit: NASA-APOD. Dark Matter in a Simulated Universe.';
            // title_b = ' Is our universe haunted? It might look that way on this dark matter map. The gravity of unseen dark matter is the leading explanation for why galaxies rotate so fast, why galaxies orbit clusters so fast, why gravitational lenses so strongly deflect light, and why visible matter is distributed as it is both in the local universe and on the cosmic microwave background. The featured image from the American Museum of Natural Historys Hay- den Planetarium Space Show Dark Universe highlights one example of how pervasive dark matter might haunt our universe. In this frame from a detailed computer simulation, complex filaments of dark matter, shown in black, are strewn about the universe like spi- der webs, while the relatively rare clumps of familiar baryonic matter are colored orange. These simulations are good statistical matches to astronomical observations. In what is perhaps a scarier turn of events, dark matter – although quite strange and in an unknown form – is no longer thought to be the strangest source of gravity in the universe. That honor now falls to dark energy, a more uniform source of repulsive gravity that seems to now dominate the expansion of the entire universe.';
            title_b = '';
            break;
        case 5:
            image = "url('/yli311/images/cover/pluto.jpg')";
            title_a = 'Credit: NASA/Johns Hopkins University Applied Physics Laboratory/Southwest Research Institute. Stereo Pluto.';
            // title_b = 'Four images from New Horizons’ Long Range Reconnaissance Imager (LORRI) were combined with color data from the Ralph instrument to create this global view of Pluto. (The lower right edge of Pluto in this view currently lacks high-resolution color coverage.) The images, taken when the spacecraft was 280,000 miles (450,000 kilometers) away, show features as small as 1.4 miles (2.2 kilometers), twice the resolution of the single-image view taken on July 13. ';
            title_b = '';
            break;
        case 6:
            image = "url('/yli311/images/cover/jupiter_art.jpg')";
            title_a = 'Credit: NASA-Juno/Rick Lundh. ';
            // title_b = 'Citizen scientist Rick Lundh created this abstract Jovian artwork using data from the JunoCam imager on NASA’s Juno spacecraft.';
            title_b = '';
            break;
        case 7:
            image = "url('/yli311/images/cover/CLASS_telescope.jpg')";
            title_a = 'Credit: Matthew Petroff (JHU/CLASS Collaboration)';
            title_b = 'The first light of the Cosmology Large Angular Scale Surveyor (CLASS) telescope on site the Andes Mountains of northern Chile';
            break;
        case 8:
            image = "url('/yli311/images/cover/LunarEclipse.jpg')";
            title_a = '';
            title_b = 'The Lunar eclipse on January 20, 2019. Photographed from the roof top of my apartment in Baltimore.';
            // title_b = '';
            break;
        case 9:
            image = "url('images/cover/HubbleLegacyField.jpg')";
            title_a = 'Credit: NASA, ESA, G. Illingworth and D. Magee (University of California, Santa Cruz), K. Whitaker (University of Connecticut), R. Bouwens (Leiden University), P. Oesch (University of Geneva,) and the Hubble Legacy Field team. ';
            // title_b = '(Part of) the Hubble Legacy Field: This Hubble Space Telescope image represents the largest, most comprehensive "history book" of galaxies in the universe. The image, a combination of nearly 7,500 separate Hubble exposures, represents 16 years\' worth of observations. The ambitious endeavor, called the Hubble Legacy Field, includes several Hubble deep-field surveys, including the eXtreme Deep Field (XDF), the deepest view of the universe. The wavelength range stretches from ultraviolet to near-infrared light, capturing all the features of galaxy assembly over time. The image mosaic presents a wide portrait of the distant universe and contains roughly 265,000 galaxies. They stretch back through 13.3 billion years of time to just 500 million years after the universe\'s birth in the big bang. The tiny, faint, most distant galaxies in the image are similar to the seedling villages from which today\'s great galaxy star-cities grew. The faintest and farthest galaxies are just one ten-billionth the brightness of what the human eye can see. The wider view contains about 30 times as many galaxies as in the Hubble Ultra Deep Field, taken in 2004. The new portrait, a mosaic of multiple snapshots, covers almost the width of the full Moon. Lying in this region is the XDF, which penetrated deeper into space than this legacy field view. However, the XDF field covers less than one-tenth of the full Moon\'s diameter.';
            title_b = '';
            break;
        case 10:
            image = "url('images/cover/CrabNebula.jpg')";
            title_a = 'Credit: NASA, ESA, G. Dubner (IAFE, CONICET-University of Buenos Aires) et al.; A. Loll et al.; T. Temim et al.; F. Seward et al.; VLA/NRAO/AUI/NSF; Chandra/CXC; Spitzer/JPL-Caltech; XMM-Newton/ESA; and Hubble/STScI. ';
            // title_b = 'Crab Nebula: From left to right are the multiwavelength observations of the Crab Nebula in radio (VLA), infrared (Spitzer), optical (Hubble), ultraviolet (XMM-Newton) and X-ray (Chandra)';
            title_b = '';
            break;

    }
    return [image, title_a, title_b + '\n' + title_a]
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
        <div class="menu-bar-box"><a href="index.html"> HOME </a></div>
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

    let image_title = get_image_title()
    header.id = 'header'
    document.body.style.backgroundImage = image_title[0]
    header_frame.title = image_title[1]

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


