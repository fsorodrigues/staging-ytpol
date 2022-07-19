<script lang="ts">
</script>

<header id="main-header" data-height-onload="84" data-height-loaded="true" data-fixed-height-onload="84" style="top: 0px;">
    <div class="container clearfix et_menu_container">
        <div class="logo_container">
            <!-- <span class="logo_helper"></span> -->
            <a class='logo_anchor' href="https://css.seas.upenn.edu/">
                <img class='logo_img' src="https://css.seas.upenn.edu/wp-content/uploads/2021/09/WEBSITE-LOGO.png" alt="Computational Social Science Lab" id="logo" />
            </a>
        </div>
        <div id="et-top-navigation">
            <nav id="top-menu-nav">
                <ul id="top-menu" class="nav">
                    <li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children menu-item-2731">
                        <a class="menu-item-anchor" href='https://css.seas.upenn.edu/about/'>About</a>
                        <ul class="sub-menu">
                            <li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-1554">
                                <a class="sub-menu-item-anchor" href="https://css.seas.upenn.edu/about/lab/">The Lab</a>
                            </li>
                            <li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-2232">
                                <a class="sub-menu-item-anchor" href="https://css.seas.upenn.edu/about/community/">CSS Community</a>
                            </li>
                        </ul>
                    </li>
                    <li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-1747">
                        <a class="menu-item-anchor" href="https://css.seas.upenn.edu/people/">People</a>
                    </li>
                    <li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-has-children menu-item-37">
                        <a class="menu-item-anchor" href="https://css.seas.upenn.edu/research/">Research</a>
                        <ul class="sub-menu">
                            <li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-735">
                                <a class="sub-menu-item-anchor" href="https://css.seas.upenn.edu/project/penn-map/">PennMAP</a>
                            </li>
                            <li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-292">
                                <a class="sub-menu-item-anchor" href="https://css.seas.upenn.edu/project/virtual-lab/">Group Dynamics</a>
                            </li>
                            <li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-291">
                                <a class="sub-menu-item-anchor" href="https://css.seas.upenn.edu/project/covid-philadelphia/">COVID-Philadelphia</a>
                            </li>
                            <li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-377">
                                <a class="sub-menu-item-anchor" href="https://css.seas.upenn.edu/project/common-sense/">Common Sense</a>
                            </li>
                        </ul>
                    </li>
                    <li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-344">
                        <a class="menu-item-anchor" href="https://css.seas.upenn.edu/partnerships/">Partners</a>
                    </li>
                    <li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-58">
                        <a class="menu-item-anchor" href="https://css.seas.upenn.edu/publications/">Publications</a>
                    </li>
                    <li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-105">
                        <a class="menu-item-anchor" href="https://css.seas.upenn.edu/blog-news-events/">News</a>
                    </li>
                </ul>
            </nav>
        </div>
    </div>
</header>

<style lang="scss">
    header {
        height: 84px;
        background-color: $css-lab-dark-blue;
        line-height: 23px;
        font-weight: 500;
        top: 0;
        width: 100%;
        box-shadow: 0 1px 0 rgb(0 0 0 / 10%);
        position: relative;
        z-index: 99999;
    }

    .container {
        height: 100%;
        width: 80%;
        max-width: 1080px;
        margin: auto;
        text-align: left;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .clearfix:after {
        visibility: hidden;
        display: block;
        font-size: 0;
        content: " ";
        clear: both;
        height: 0;
    }

    .logo_container {
        height: 60%;
        width: auto;
    }

    .logo_anchor{
        display: block;
        height: 100%;
    }

    .logo_img {
        height: 100%;
        width: auto;
    }

    .nav {
        display: flex;
    }

    .menu-item, .menu-item-has-children {
        display: inline-block;
        font-size: 14px;
        padding-right: 22px;

        .sub-menu {
            position: absolute;
            padding: 20px 0;
            z-index: 9999;
            width: 240px;
            visibility: hidden;
            opacity: 0;
            background-color: $css-lab-dark-blue-transparent;
            border-top: 3px solid $css-lab-dark-red;
            box-shadow: 0 2px 5px rgba(0,0,0,.1);
            -moz-box-shadow: 0 2px 5px rgba(0,0,0,.1);
            -webkit-box-shadow: 0 2px 5px rgba(0,0,0,.1);
            -webkit-transform: translateZ(0);
            text-align: left;
        }
    }

    .menu-item-has-children:hover {
        .sub-menu {
            visibility: visible;
            opacity: 1;
            margin: 29px 0 0 0;
        }
    }

    .menu-item-anchor {
        color: $light-grey;
        font-weight: 300;
        text-transform: uppercase;
    }

    .sub-menu-item-anchor {
        display: block;
        color: $light-grey;
        font-weight: 300;
        margin: 0 auto;
    }

    .sub-menu {
        > .menu-item {
            padding: 0 20px;
            line-height: 2em;

            a {
                width: 200px;
                padding: 6px 20px;
            }
        }
    }

</style>

<!-- <div id="et-top-navigation" data-height="70" data-fixed-height="70" style="padding-left: 210px;">
    <nav id="top-menu-nav">
<ul id="top-menu" class="nav"><li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children menu-item-2731"><a>About</a>
<ul class="sub-menu">
<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-1554"><a href="https://css.seas.upenn.edu/about/lab/">The Lab</a></li>
<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-2232"><a href="https://css.seas.upenn.edu/about/community/">CSS Community</a></li>
</ul>
</li>
<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-1747"><a href="https://css.seas.upenn.edu/people/">People</a></li>
<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-has-children menu-item-37"><a href="https://css.seas.upenn.edu/research/">Research</a>
<ul class="sub-menu">
<li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-735"><a href="https://css.seas.upenn.edu/project/penn-map/">PennMAP</a></li>
<li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-292"><a href="https://css.seas.upenn.edu/project/virtual-lab/">Group Dynamics</a></li>
<li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-291"><a href="https://css.seas.upenn.edu/project/covid-philadelphia/">COVID-Philadelphia</a></li>
<li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-377"><a href="https://css.seas.upenn.edu/project/common-sense/">Common Sense</a></li>
</ul>
</li>
<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-344"><a href="https://css.seas.upenn.edu/partnerships/">Partners</a></li>
<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-58"><a href="https://css.seas.upenn.edu/publications/">Publications</a></li>
<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-105"><a href="https://css.seas.upenn.edu/blog-news-events/">News</a></li>
</ul>					</nav>



    <div id="et_top_search">
<span id="et_search_icon"></span>
</div>

<div id="et_mobile_nav_menu">
<div class="mobile_nav closed">
<span class="select_page">Select Page</span>
<span class="mobile_menu_bar mobile_menu_bar_toggle"></span>
<ul id="mobile_menu" class="et_mobile_menu"><li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children menu-item-2731 et_first_mobile_item"><a>About</a>
<ul class="sub-menu">
<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-1554"><a href="https://css.seas.upenn.edu/about/lab/">The Lab</a></li>
<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-2232"><a href="https://css.seas.upenn.edu/about/community/">CSS Community</a></li>
</ul>
</li>
<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-1747"><a href="https://css.seas.upenn.edu/people/">People</a></li>
<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-has-children menu-item-37"><a href="https://css.seas.upenn.edu/research/">Research</a>
<ul class="sub-menu">
<li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-735"><a href="https://css.seas.upenn.edu/project/penn-map/">PennMAP</a></li>
<li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-292"><a href="https://css.seas.upenn.edu/project/virtual-lab/">Group Dynamics</a></li>
<li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-291"><a href="https://css.seas.upenn.edu/project/covid-philadelphia/">COVID-Philadelphia</a></li>
<li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-377"><a href="https://css.seas.upenn.edu/project/common-sense/">Common Sense</a></li>
</ul>
</li>
<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-344"><a href="https://css.seas.upenn.edu/partnerships/">Partners</a></li>
<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-58"><a href="https://css.seas.upenn.edu/publications/">Publications</a></li>
<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-105"><a href="https://css.seas.upenn.edu/blog-news-events/">News</a></li>
</ul></div>
</div>			</div>
</div>
<div class="et_search_outer">
<div class="container et_search_form_container">
<form role="search" method="get" class="et-search-form" action="https://css.seas.upenn.edu/">
<input type="search" class="et-search-field" placeholder="Search …" value="" name="s" title="Search for:">				</form>
<span class="et_close_search_field"></span>
</div>
</div> -->