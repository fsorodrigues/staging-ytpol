
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.49.0' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src/components/header/Header.svelte generated by Svelte v3.49.0 */

    const file$1 = "src/components/header/Header.svelte";

    function create_fragment$2(ctx) {
    	let header;
    	let div2;
    	let div0;
    	let a0;
    	let img;
    	let img_src_value;
    	let t0;
    	let div1;
    	let nav;
    	let ul2;
    	let li2;
    	let a1;
    	let t2;
    	let ul0;
    	let li0;
    	let a2;
    	let t4;
    	let li1;
    	let a3;
    	let t6;
    	let li3;
    	let a4;
    	let t8;
    	let li8;
    	let a5;
    	let t10;
    	let ul1;
    	let li4;
    	let a6;
    	let t12;
    	let li5;
    	let a7;
    	let t14;
    	let li6;
    	let a8;
    	let t16;
    	let li7;
    	let a9;
    	let t18;
    	let li9;
    	let a10;
    	let t20;
    	let li10;
    	let a11;
    	let t22;
    	let li11;
    	let a12;

    	const block = {
    		c: function create() {
    			header = element("header");
    			div2 = element("div");
    			div0 = element("div");
    			a0 = element("a");
    			img = element("img");
    			t0 = space();
    			div1 = element("div");
    			nav = element("nav");
    			ul2 = element("ul");
    			li2 = element("li");
    			a1 = element("a");
    			a1.textContent = "About";
    			t2 = space();
    			ul0 = element("ul");
    			li0 = element("li");
    			a2 = element("a");
    			a2.textContent = "The Lab";
    			t4 = space();
    			li1 = element("li");
    			a3 = element("a");
    			a3.textContent = "CSS Community";
    			t6 = space();
    			li3 = element("li");
    			a4 = element("a");
    			a4.textContent = "People";
    			t8 = space();
    			li8 = element("li");
    			a5 = element("a");
    			a5.textContent = "Research";
    			t10 = space();
    			ul1 = element("ul");
    			li4 = element("li");
    			a6 = element("a");
    			a6.textContent = "PennMAP";
    			t12 = space();
    			li5 = element("li");
    			a7 = element("a");
    			a7.textContent = "Group Dynamics";
    			t14 = space();
    			li6 = element("li");
    			a8 = element("a");
    			a8.textContent = "COVID-Philadelphia";
    			t16 = space();
    			li7 = element("li");
    			a9 = element("a");
    			a9.textContent = "Common Sense";
    			t18 = space();
    			li9 = element("li");
    			a10 = element("a");
    			a10.textContent = "Partners";
    			t20 = space();
    			li10 = element("li");
    			a11 = element("a");
    			a11.textContent = "Publications";
    			t22 = space();
    			li11 = element("li");
    			a12 = element("a");
    			a12.textContent = "News";
    			attr_dev(img, "class", "logo_img svelte-vklvp2");
    			if (!src_url_equal(img.src, img_src_value = "https://css.seas.upenn.edu/wp-content/uploads/2021/09/WEBSITE-LOGO.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Computational Social Science Lab");
    			attr_dev(img, "id", "logo");
    			add_location(img, file$1, 7, 16, 387);
    			attr_dev(a0, "class", "logo_anchor svelte-vklvp2");
    			attr_dev(a0, "href", "https://css.seas.upenn.edu/");
    			add_location(a0, file$1, 6, 12, 312);
    			attr_dev(div0, "class", "logo_container svelte-vklvp2");
    			add_location(div0, file$1, 4, 8, 216);
    			attr_dev(a1, "class", "menu-item-anchor svelte-vklvp2");
    			attr_dev(a1, "href", "https://css.seas.upenn.edu/about/");
    			add_location(a1, file$1, 14, 24, 841);
    			attr_dev(a2, "class", "sub-menu-item-anchor svelte-vklvp2");
    			attr_dev(a2, "href", "https://css.seas.upenn.edu/about/lab/");
    			add_location(a2, file$1, 17, 32, 1111);
    			attr_dev(li0, "class", "menu-item menu-item-type-post_type menu-item-object-page menu-item-1554 svelte-vklvp2");
    			add_location(li0, file$1, 16, 28, 994);
    			attr_dev(a3, "class", "sub-menu-item-anchor svelte-vklvp2");
    			attr_dev(a3, "href", "https://css.seas.upenn.edu/about/community/");
    			add_location(a3, file$1, 20, 32, 1379);
    			attr_dev(li1, "class", "menu-item menu-item-type-post_type menu-item-object-page menu-item-2232 svelte-vklvp2");
    			add_location(li1, file$1, 19, 28, 1262);
    			attr_dev(ul0, "class", "sub-menu svelte-vklvp2");
    			add_location(ul0, file$1, 15, 24, 944);
    			attr_dev(li2, "class", "menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children menu-item-2731 svelte-vklvp2");
    			add_location(li2, file$1, 13, 20, 710);
    			attr_dev(a4, "class", "menu-item-anchor svelte-vklvp2");
    			attr_dev(a4, "href", "https://css.seas.upenn.edu/people/");
    			add_location(a4, file$1, 25, 24, 1699);
    			attr_dev(li3, "class", "menu-item menu-item-type-post_type menu-item-object-page menu-item-1747 svelte-vklvp2");
    			add_location(li3, file$1, 24, 20, 1590);
    			attr_dev(a5, "class", "menu-item-anchor svelte-vklvp2");
    			attr_dev(a5, "href", "https://css.seas.upenn.edu/research/");
    			add_location(a5, file$1, 28, 24, 1956);
    			attr_dev(a6, "class", "sub-menu-item-anchor svelte-vklvp2");
    			attr_dev(a6, "href", "https://css.seas.upenn.edu/project/penn-map/");
    			add_location(a6, file$1, 31, 32, 2230);
    			attr_dev(li4, "class", "menu-item menu-item-type-custom menu-item-object-custom menu-item-735 svelte-vklvp2");
    			add_location(li4, file$1, 30, 28, 2115);
    			attr_dev(a7, "class", "sub-menu-item-anchor svelte-vklvp2");
    			attr_dev(a7, "href", "https://css.seas.upenn.edu/project/virtual-lab/");
    			add_location(a7, file$1, 34, 32, 2503);
    			attr_dev(li5, "class", "menu-item menu-item-type-custom menu-item-object-custom menu-item-292 svelte-vklvp2");
    			add_location(li5, file$1, 33, 28, 2388);
    			attr_dev(a8, "class", "sub-menu-item-anchor svelte-vklvp2");
    			attr_dev(a8, "href", "https://css.seas.upenn.edu/project/covid-philadelphia/");
    			add_location(a8, file$1, 37, 32, 2786);
    			attr_dev(li6, "class", "menu-item menu-item-type-custom menu-item-object-custom menu-item-291 svelte-vklvp2");
    			add_location(li6, file$1, 36, 28, 2671);
    			attr_dev(a9, "class", "sub-menu-item-anchor svelte-vklvp2");
    			attr_dev(a9, "href", "https://css.seas.upenn.edu/project/common-sense/");
    			add_location(a9, file$1, 40, 32, 3080);
    			attr_dev(li7, "class", "menu-item menu-item-type-custom menu-item-object-custom menu-item-377 svelte-vklvp2");
    			add_location(li7, file$1, 39, 28, 2965);
    			attr_dev(ul1, "class", "sub-menu svelte-vklvp2");
    			add_location(ul1, file$1, 29, 24, 2065);
    			attr_dev(li8, "class", "menu-item menu-item-type-post_type menu-item-object-page menu-item-has-children menu-item-37 svelte-vklvp2");
    			add_location(li8, file$1, 27, 20, 1826);
    			attr_dev(a10, "class", "menu-item-anchor svelte-vklvp2");
    			attr_dev(a10, "href", "https://css.seas.upenn.edu/partnerships/");
    			add_location(a10, file$1, 45, 24, 3403);
    			attr_dev(li9, "class", "menu-item menu-item-type-post_type menu-item-object-page menu-item-344 svelte-vklvp2");
    			add_location(li9, file$1, 44, 20, 3295);
    			attr_dev(a11, "class", "menu-item-anchor svelte-vklvp2");
    			attr_dev(a11, "href", "https://css.seas.upenn.edu/publications/");
    			add_location(a11, file$1, 48, 24, 3645);
    			attr_dev(li10, "class", "menu-item menu-item-type-post_type menu-item-object-page menu-item-58 svelte-vklvp2");
    			add_location(li10, file$1, 47, 20, 3538);
    			attr_dev(a12, "class", "menu-item-anchor svelte-vklvp2");
    			attr_dev(a12, "href", "https://css.seas.upenn.edu/blog-news-events/");
    			add_location(a12, file$1, 51, 24, 3892);
    			attr_dev(li11, "class", "menu-item menu-item-type-post_type menu-item-object-page menu-item-105 svelte-vklvp2");
    			add_location(li11, file$1, 50, 20, 3784);
    			attr_dev(ul2, "id", "top-menu");
    			attr_dev(ul2, "class", "nav svelte-vklvp2");
    			add_location(ul2, file$1, 12, 16, 659);
    			attr_dev(nav, "id", "top-menu-nav");
    			add_location(nav, file$1, 11, 12, 619);
    			attr_dev(div1, "id", "et-top-navigation");
    			add_location(div1, file$1, 10, 8, 578);
    			attr_dev(div2, "class", "container clearfix et_menu_container svelte-vklvp2");
    			add_location(div2, file$1, 3, 4, 157);
    			attr_dev(header, "id", "main-header");
    			attr_dev(header, "data-height-onload", "84");
    			attr_dev(header, "data-height-loaded", "true");
    			attr_dev(header, "data-fixed-height-onload", "84");
    			set_style(header, "top", "0px");
    			attr_dev(header, "class", "svelte-vklvp2");
    			add_location(header, file$1, 2, 0, 29);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, div2);
    			append_dev(div2, div0);
    			append_dev(div0, a0);
    			append_dev(a0, img);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div1, nav);
    			append_dev(nav, ul2);
    			append_dev(ul2, li2);
    			append_dev(li2, a1);
    			append_dev(li2, t2);
    			append_dev(li2, ul0);
    			append_dev(ul0, li0);
    			append_dev(li0, a2);
    			append_dev(ul0, t4);
    			append_dev(ul0, li1);
    			append_dev(li1, a3);
    			append_dev(ul2, t6);
    			append_dev(ul2, li3);
    			append_dev(li3, a4);
    			append_dev(ul2, t8);
    			append_dev(ul2, li8);
    			append_dev(li8, a5);
    			append_dev(li8, t10);
    			append_dev(li8, ul1);
    			append_dev(ul1, li4);
    			append_dev(li4, a6);
    			append_dev(ul1, t12);
    			append_dev(ul1, li5);
    			append_dev(li5, a7);
    			append_dev(ul1, t14);
    			append_dev(ul1, li6);
    			append_dev(li6, a8);
    			append_dev(ul1, t16);
    			append_dev(ul1, li7);
    			append_dev(li7, a9);
    			append_dev(ul2, t18);
    			append_dev(ul2, li9);
    			append_dev(li9, a10);
    			append_dev(ul2, t20);
    			append_dev(ul2, li10);
    			append_dev(li10, a11);
    			append_dev(ul2, t22);
    			append_dev(ul2, li11);
    			append_dev(li11, a12);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Header', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/components/footer/Footer.svelte generated by Svelte v3.49.0 */

    const file = "src/components/footer/Footer.svelte";

    function create_fragment$1(ctx) {
    	let footer;
    	let div28;
    	let div27;
    	let div20;
    	let div3;
    	let div0;
    	let a0;
    	let span0;
    	let img0;
    	let img0_src_value;
    	let t0;
    	let div1;
    	let a1;
    	let span1;
    	let img1;
    	let img1_src_value;
    	let t1;
    	let div2;
    	let a2;
    	let span2;
    	let img2;
    	let img2_src_value;
    	let t2;
    	let div12;
    	let div5;
    	let div4;
    	let h20;
    	let t4;
    	let div7;
    	let div6;
    	let t5;
    	let div11;
    	let div10;
    	let div9;
    	let div8;
    	let nav;
    	let ul;
    	let li0;
    	let a3;
    	let t7;
    	let li1;
    	let a4;
    	let t9;
    	let li2;
    	let a5;
    	let t11;
    	let li3;
    	let a6;
    	let t13;
    	let li4;
    	let a7;
    	let t15;
    	let li5;
    	let a8;
    	let t17;
    	let div19;
    	let div14;
    	let div13;
    	let h21;
    	let t19;
    	let div16;
    	let div15;
    	let t20;
    	let div18;
    	let div17;
    	let p0;
    	let t21;
    	let br0;
    	let t22;
    	let br1;
    	let t23;
    	let t24;
    	let p1;
    	let t26;
    	let p2;
    	let t28;
    	let div26;
    	let div25;
    	let div22;
    	let div21;
    	let p3;
    	let a9;
    	let t30;
    	let a10;
    	let t32;
    	let a11;
    	let t34;
    	let a12;
    	let t36;
    	let a13;
    	let t38;
    	let a14;
    	let t40;
    	let div24;
    	let div23;
    	let p4;
    	let em0;
    	let strong0;
    	let t41;
    	let p5;
    	let em1;
    	let a15;
    	let strong1;
    	let t43;

    	const block = {
    		c: function create() {
    			footer = element("footer");
    			div28 = element("div");
    			div27 = element("div");
    			div20 = element("div");
    			div3 = element("div");
    			div0 = element("div");
    			a0 = element("a");
    			span0 = element("span");
    			img0 = element("img");
    			t0 = space();
    			div1 = element("div");
    			a1 = element("a");
    			span1 = element("span");
    			img1 = element("img");
    			t1 = space();
    			div2 = element("div");
    			a2 = element("a");
    			span2 = element("span");
    			img2 = element("img");
    			t2 = space();
    			div12 = element("div");
    			div5 = element("div");
    			div4 = element("div");
    			h20 = element("h2");
    			h20.textContent = "Navigate";
    			t4 = space();
    			div7 = element("div");
    			div6 = element("div");
    			t5 = space();
    			div11 = element("div");
    			div10 = element("div");
    			div9 = element("div");
    			div8 = element("div");
    			nav = element("nav");
    			ul = element("ul");
    			li0 = element("li");
    			a3 = element("a");
    			a3.textContent = "About";
    			t7 = space();
    			li1 = element("li");
    			a4 = element("a");
    			a4.textContent = "People";
    			t9 = space();
    			li2 = element("li");
    			a5 = element("a");
    			a5.textContent = "Research";
    			t11 = space();
    			li3 = element("li");
    			a6 = element("a");
    			a6.textContent = "Partners";
    			t13 = space();
    			li4 = element("li");
    			a7 = element("a");
    			a7.textContent = "Publications";
    			t15 = space();
    			li5 = element("li");
    			a8 = element("a");
    			a8.textContent = "News";
    			t17 = space();
    			div19 = element("div");
    			div14 = element("div");
    			div13 = element("div");
    			h21 = element("h2");
    			h21.textContent = "Contact";
    			t19 = space();
    			div16 = element("div");
    			div15 = element("div");
    			t20 = space();
    			div18 = element("div");
    			div17 = element("div");
    			p0 = element("p");
    			t21 = text("3401 Walnut Street");
    			br0 = element("br");
    			t22 = text("Suite 417B");
    			br1 = element("br");
    			t23 = text("Philadelphia PA, 19104");
    			t24 = space();
    			p1 = element("p");
    			p1.textContent = "CSSLab@seas.upenn.edu";
    			t26 = space();
    			p2 = element("p");
    			p2.textContent = "(215) 573-7098";
    			t28 = space();
    			div26 = element("div");
    			div25 = element("div");
    			div22 = element("div");
    			div21 = element("div");
    			p3 = element("p");
    			a9 = element("a");
    			a9.textContent = "Penn Homepage";
    			t30 = space();
    			a10 = element("a");
    			a10.textContent = "Disclaimer";
    			t32 = space();
    			a11 = element("a");
    			a11.textContent = "Emergency Services";
    			t34 = space();
    			a12 = element("a");
    			a12.textContent = "Privacy Policy";
    			t36 = space();
    			a13 = element("a");
    			a13.textContent = "Report Accessibility Issues and Get Help";
    			t38 = space();
    			a14 = element("a");
    			a14.textContent = "Report Copyright Infringement";
    			t40 = space();
    			div24 = element("div");
    			div23 = element("div");
    			p4 = element("p");
    			em0 = element("em");
    			strong0 = element("strong");
    			t41 = space();
    			p5 = element("p");
    			em1 = element("em");
    			a15 = element("a");
    			strong1 = element("strong");
    			strong1.textContent = "Interested in working at the CSSLab?";
    			t43 = text(" Click here to view opportunities for Penn students");
    			attr_dev(img0, "loading", "lazy");
    			attr_dev(img0, "width", "480");
    			attr_dev(img0, "height", "123");
    			if (!src_url_equal(img0.src, img0_src_value = "https://css.seas.upenn.edu/wp-content/uploads/2022/04/newfooter-1-seas.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "Penn Engineering");
    			attr_dev(img0, "title", "Penn Engineering");
    			attr_dev(img0, "srcset", "https://css.seas.upenn.edu/wp-content/uploads/2022/04/newfooter-1-seas.png 480w, https://css.seas.upenn.edu/wp-content/uploads/2022/04/newfooter-1-seas-300x77.png 300w");
    			attr_dev(img0, "sizes", "(max-width: 480px) 100vw, 480px");
    			attr_dev(img0, "class", "wp-image-3438 svelte-1c0s089");
    			add_location(img0, file, 10, 32, 784);
    			attr_dev(span0, "class", "et_pb_image_wrap  svelte-1c0s089");
    			add_location(span0, file, 9, 28, 719);
    			attr_dev(a0, "href", "https://www.seas.upenn.edu/");
    			attr_dev(a0, "target", "_blank");
    			attr_dev(a0, "class", "svelte-1c0s089");
    			add_location(a0, file, 8, 24, 636);
    			attr_dev(div0, "class", "et_pb_module et_pb_image et_pb_image_0_tb_footer et_pb_image_sticky svelte-1c0s089");
    			add_location(div0, file, 7, 20, 530);
    			attr_dev(img1, "loading", "lazy");
    			attr_dev(img1, "width", "480");
    			attr_dev(img1, "height", "123");
    			if (!src_url_equal(img1.src, img1_src_value = "https://css.seas.upenn.edu/wp-content/uploads/2022/04/newfooter-2-asc.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "Penn Engineering");
    			attr_dev(img1, "title", "Penn Engineering");
    			attr_dev(img1, "srcset", "https://css.seas.upenn.edu/wp-content/uploads/2022/04/newfooter-2-asc.png 480w, https://css.seas.upenn.edu/wp-content/uploads/2022/04/newfooter-2-asc-300x77.png 300w");
    			attr_dev(img1, "sizes", "(max-width: 480px) 100vw, 480px");
    			attr_dev(img1, "class", "wp-image-3440 svelte-1c0s089");
    			add_location(img1, file, 26, 32, 1897);
    			attr_dev(span1, "class", "et_pb_image_wrap  svelte-1c0s089");
    			add_location(span1, file, 25, 28, 1832);
    			attr_dev(a1, "href", "https://www.asc.upenn.edu/");
    			attr_dev(a1, "target", "_blank");
    			attr_dev(a1, "class", "svelte-1c0s089");
    			add_location(a1, file, 24, 24, 1750);
    			attr_dev(div1, "class", "et_pb_module et_pb_image et_pb_image_1_tb_footer et_pb_image_sticky svelte-1c0s089");
    			add_location(div1, file, 23, 20, 1644);
    			attr_dev(img2, "loading", "lazy");
    			attr_dev(img2, "width", "480");
    			attr_dev(img2, "height", "111");
    			if (!src_url_equal(img2.src, img2_src_value = "https://css.seas.upenn.edu/wp-content/uploads/2022/04/newfooter-3-wharton.png")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "Penn Engineering");
    			attr_dev(img2, "title", "Penn Engineering");
    			attr_dev(img2, "srcset", "https://css.seas.upenn.edu/wp-content/uploads/2022/04/newfooter-3-wharton.png 480w, https://css.seas.upenn.edu/wp-content/uploads/2022/04/newfooter-3-wharton-300x69.png 300w");
    			attr_dev(img2, "sizes", "(max-width: 480px) 100vw, 480px");
    			attr_dev(img2, "class", "wp-image-3439 svelte-1c0s089");
    			add_location(img2, file, 42, 32, 3003);
    			attr_dev(span2, "class", "et_pb_image_wrap  svelte-1c0s089");
    			add_location(span2, file, 41, 28, 2938);
    			attr_dev(a2, "href", "https://www.wharton.upenn.edu/");
    			attr_dev(a2, "target", "_blank");
    			attr_dev(a2, "class", "svelte-1c0s089");
    			add_location(a2, file, 40, 24, 2852);
    			attr_dev(div2, "class", "et_pb_module et_pb_image et_pb_image_2_tb_footer et_pb_image_sticky svelte-1c0s089");
    			add_location(div2, file, 39, 20, 2746);
    			attr_dev(div3, "class", "et_pb_column et_pb_column_1_4 et_pb_column_0_tb_footer global-footer-column-1 et_pb_css_mix_blend_mode_passthrough svelte-1c0s089");
    			add_location(div3, file, 6, 16, 380);
    			attr_dev(h20, "class", "svelte-1c0s089");
    			add_location(h20, file, 60, 24, 4229);
    			attr_dev(div4, "class", "et_pb_text_inner svelte-1c0s089");
    			add_location(div4, file, 59, 20, 4174);
    			attr_dev(div5, "class", "et_pb_module et_pb_text et_pb_text_0_tb_footer et_pb_text_align_left et_pb_bg_layout_light svelte-1c0s089");
    			add_location(div5, file, 58, 16, 4048);
    			attr_dev(div6, "class", "et_pb_divider_internal svelte-1c0s089");
    			add_location(div6, file, 64, 20, 4436);
    			attr_dev(div7, "class", "et_pb_module et_pb_divider et_pb_divider_0_tb_footer et_pb_divider_position_ et_pb_space svelte-1c0s089");
    			add_location(div7, file, 63, 16, 4313);
    			attr_dev(a3, "href", "https://css.seas.upenn.edu/about/");
    			attr_dev(a3, "class", "svelte-1c0s089");
    			add_location(a3, file, 73, 44, 5270);
    			attr_dev(li0, "id", "menu-item-3425");
    			attr_dev(li0, "class", "et_pb_menu_page_id-2233 menu-item menu-item-type-post_type menu-item-object-page menu-item-3425 svelte-1c0s089");
    			add_location(li0, file, 72, 40, 5097);
    			attr_dev(a4, "href", "https://css.seas.upenn.edu/people/");
    			attr_dev(a4, "class", "svelte-1c0s089");
    			add_location(a4, file, 76, 44, 5583);
    			attr_dev(li1, "id", "menu-item-3426");
    			attr_dev(li1, "class", "et_pb_menu_page_id-1732 menu-item menu-item-type-post_type menu-item-object-page menu-item-3426 svelte-1c0s089");
    			add_location(li1, file, 75, 40, 5410);
    			attr_dev(a5, "href", "https://css.seas.upenn.edu/research/");
    			attr_dev(a5, "class", "svelte-1c0s089");
    			add_location(a5, file, 79, 44, 5896);
    			attr_dev(li2, "id", "menu-item-3430");
    			attr_dev(li2, "class", "et_pb_menu_page_id-22 menu-item menu-item-type-post_type menu-item-object-page menu-item-3430 svelte-1c0s089");
    			add_location(li2, file, 78, 40, 5725);
    			attr_dev(a6, "href", "https://css.seas.upenn.edu/partnerships/");
    			attr_dev(a6, "class", "svelte-1c0s089");
    			add_location(a6, file, 82, 44, 6213);
    			attr_dev(li3, "id", "menu-item-3428");
    			attr_dev(li3, "class", "et_pb_menu_page_id-65 menu-item menu-item-type-post_type menu-item-object-page menu-item-3428 svelte-1c0s089");
    			add_location(li3, file, 81, 40, 6042);
    			attr_dev(a7, "href", "https://css.seas.upenn.edu/publications/");
    			attr_dev(a7, "class", "svelte-1c0s089");
    			add_location(a7, file, 85, 44, 6534);
    			attr_dev(li4, "id", "menu-item-3429");
    			attr_dev(li4, "class", "et_pb_menu_page_id-52 menu-item menu-item-type-post_type menu-item-object-page menu-item-3429 svelte-1c0s089");
    			add_location(li4, file, 84, 40, 6363);
    			attr_dev(a8, "href", "https://css.seas.upenn.edu/blog-news-events/");
    			attr_dev(a8, "class", "svelte-1c0s089");
    			add_location(a8, file, 88, 44, 6859);
    			attr_dev(li5, "id", "menu-item-3427");
    			attr_dev(li5, "class", "et_pb_menu_page_id-92 menu-item menu-item-type-post_type menu-item-object-page menu-item-3427 svelte-1c0s089");
    			add_location(li5, file, 87, 40, 6688);
    			attr_dev(ul, "id", "menu-footer-menu-new");
    			attr_dev(ul, "class", "et-menu nav svelte-1c0s089");
    			add_location(ul, file, 71, 36, 5006);
    			attr_dev(nav, "class", "et-menu-nav svelte-1c0s089");
    			add_location(nav, file, 70, 32, 4944);
    			attr_dev(div8, "class", "et_pb_menu__menu svelte-1c0s089");
    			add_location(div8, file, 69, 28, 4881);
    			attr_dev(div9, "class", "et_pb_menu__wrap");
    			add_location(div9, file, 68, 24, 4822);
    			attr_dev(div10, "class", "et_pb_menu_inner_container clearfix");
    			add_location(div10, file, 67, 20, 4748);
    			attr_dev(div11, "class", "et_pb_module et_pb_menu et_pb_menu_0_tb_footer footer-vertical-menu et_pb_bg_layout_light et_pb_text_align_left et_dropdown_animation_fade et_pb_menu--without-logo et_pb_menu--style-left_aligned svelte-1c0s089");
    			add_location(div11, file, 66, 16, 4518);
    			attr_dev(div12, "class", "et_pb_column et_pb_column_1_4 et_pb_column_1_tb_footer global-footer-column-2 et_pb_css_mix_blend_mode_passthrough et_pb_column--with-menu svelte-1c0s089");
    			add_location(div12, file, 57, 12, 3878);
    			attr_dev(h21, "class", "svelte-1c0s089");
    			add_location(h21, file, 101, 16, 7497);
    			attr_dev(div13, "class", "et_pb_text_inner svelte-1c0s089");
    			add_location(div13, file, 100, 12, 7450);
    			attr_dev(div14, "class", "et_pb_module et_pb_text et_pb_text_1_tb_footer et_pb_text_align_left et_pb_bg_layout_light svelte-1c0s089");
    			add_location(div14, file, 99, 8, 7332);
    			attr_dev(div15, "class", "et_pb_divider_internal svelte-1c0s089");
    			add_location(div15, file, 105, 12, 7671);
    			attr_dev(div16, "class", "et_pb_module et_pb_divider et_pb_divider_1_tb_footer et_pb_divider_position_ et_pb_space svelte-1c0s089");
    			add_location(div16, file, 104, 8, 7556);
    			add_location(br0, file, 109, 37, 7923);
    			add_location(br1, file, 109, 51, 7937);
    			attr_dev(p0, "class", "svelte-1c0s089");
    			add_location(p0, file, 109, 16, 7902);
    			attr_dev(p1, "class", "svelte-1c0s089");
    			add_location(p1, file, 110, 16, 7984);
    			attr_dev(p2, "class", "svelte-1c0s089");
    			add_location(p2, file, 111, 16, 8029);
    			attr_dev(div17, "class", "et_pb_text_inner svelte-1c0s089");
    			add_location(div17, file, 108, 12, 7855);
    			attr_dev(div18, "class", "et_pb_module et_pb_text et_pb_text_2_tb_footer et_pb_text_align_left et_pb_bg_layout_light svelte-1c0s089");
    			add_location(div18, file, 107, 8, 7737);
    			attr_dev(div19, "class", "et_pb_column et_pb_column_1_4 et_pb_column_2_tb_footer global-footer-column-3 et_pb_css_mix_blend_mode_passthrough svelte-1c0s089");
    			add_location(div19, file, 98, 4, 7194);
    			attr_dev(div20, "class", "et_pb_row et_pb_row_0_tb_footer et_pb_row--with-menu et_pb_row_4col svelte-1c0s089");
    			set_style(div20, "z-index", "3");
    			add_location(div20, file, 5, 12, 262);
    			attr_dev(a9, "href", "https://www.upenn.edu/");
    			attr_dev(a9, "class", "svelte-1c0s089");
    			add_location(a9, file, 134, 24, 9569);
    			attr_dev(a10, "href", "https://www.upenn.edu/about/disclaimer");
    			attr_dev(a10, "class", "svelte-1c0s089");
    			add_location(a10, file, 135, 24, 9644);
    			attr_dev(a11, "href", "https://www.publicsafety.upenn.edu/contact/");
    			attr_dev(a11, "class", "svelte-1c0s089");
    			add_location(a11, file, 136, 24, 9732);
    			attr_dev(a12, "href", "https://www.upenn.edu/about/privacy-policy");
    			attr_dev(a12, "class", "svelte-1c0s089");
    			add_location(a12, file, 137, 24, 9833);
    			attr_dev(a13, "href", "https://accessibility.web-resources.upenn.edu/get-help");
    			attr_dev(a13, "class", "svelte-1c0s089");
    			add_location(a13, file, 138, 24, 9929);
    			attr_dev(a14, "href", "https://www.upenn.edu/about/report-copyright-infringement");
    			attr_dev(a14, "class", "svelte-1c0s089");
    			add_location(a14, file, 139, 24, 10063);
    			set_style(p3, "text-align", "center");
    			attr_dev(p3, "class", "svelte-1c0s089");
    			add_location(p3, file, 133, 20, 9513);
    			attr_dev(div21, "class", "et_pb_text_inner svelte-1c0s089");
    			add_location(div21, file, 132, 16, 9462);
    			attr_dev(div22, "class", "et_pb_module et_pb_text et_pb_text_4_tb_footer et_pb_text_align_left et_pb_bg_layout_light");
    			add_location(div22, file, 131, 12, 9340);
    			add_location(strong0, file, 145, 55, 10452);
    			add_location(em0, file, 145, 51, 10448);
    			set_style(p4, "text-align", "center");
    			attr_dev(p4, "class", "svelte-1c0s089");
    			add_location(p4, file, 145, 20, 10417);
    			add_location(strong1, file, 146, 122, 10601);
    			attr_dev(a15, "href", "https://css.seas.upenn.edu/research-assistant-positions/");
    			attr_dev(a15, "class", "svelte-1c0s089");
    			add_location(a15, file, 146, 55, 10534);
    			add_location(em1, file, 146, 51, 10530);
    			set_style(p5, "text-align", "center");
    			attr_dev(p5, "class", "svelte-1c0s089");
    			add_location(p5, file, 146, 20, 10499);
    			attr_dev(div23, "class", "et_pb_text_inner svelte-1c0s089");
    			add_location(div23, file, 144, 16, 10366);
    			attr_dev(div24, "class", "et_pb_module et_pb_text et_pb_text_5_tb_footer et_pb_text_align_left et_pb_bg_layout_light");
    			add_location(div24, file, 143, 12, 10244);
    			attr_dev(div25, "class", "et_pb_column et_pb_column_4_4 et_pb_column_4_tb_footer et_pb_css_mix_blend_mode_passthrough et-last-child");
    			add_location(div25, file, 130, 8, 9207);
    			attr_dev(div26, "class", "et_pb_row et_pb_row_1_tb_footer et_pb_equal_columns svelte-1c0s089");
    			add_location(div26, file, 129, 4, 9133);
    			attr_dev(div27, "class", "et_pb_section et_pb_section_0_tb_footer et_pb_with_background et_section_regular et_pb_section--with-menu svelte-1c0s089");
    			add_location(div27, file, 4, 8, 130);
    			attr_dev(div28, "class", "et_builder_inner_content et_pb_gutters3");
    			add_location(div28, file, 3, 4, 68);
    			attr_dev(footer, "class", "et-l et-l--footer svelte-1c0s089");
    			add_location(footer, file, 2, 0, 29);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, footer, anchor);
    			append_dev(footer, div28);
    			append_dev(div28, div27);
    			append_dev(div27, div20);
    			append_dev(div20, div3);
    			append_dev(div3, div0);
    			append_dev(div0, a0);
    			append_dev(a0, span0);
    			append_dev(span0, img0);
    			append_dev(div3, t0);
    			append_dev(div3, div1);
    			append_dev(div1, a1);
    			append_dev(a1, span1);
    			append_dev(span1, img1);
    			append_dev(div3, t1);
    			append_dev(div3, div2);
    			append_dev(div2, a2);
    			append_dev(a2, span2);
    			append_dev(span2, img2);
    			append_dev(div20, t2);
    			append_dev(div20, div12);
    			append_dev(div12, div5);
    			append_dev(div5, div4);
    			append_dev(div4, h20);
    			append_dev(div12, t4);
    			append_dev(div12, div7);
    			append_dev(div7, div6);
    			append_dev(div12, t5);
    			append_dev(div12, div11);
    			append_dev(div11, div10);
    			append_dev(div10, div9);
    			append_dev(div9, div8);
    			append_dev(div8, nav);
    			append_dev(nav, ul);
    			append_dev(ul, li0);
    			append_dev(li0, a3);
    			append_dev(ul, t7);
    			append_dev(ul, li1);
    			append_dev(li1, a4);
    			append_dev(ul, t9);
    			append_dev(ul, li2);
    			append_dev(li2, a5);
    			append_dev(ul, t11);
    			append_dev(ul, li3);
    			append_dev(li3, a6);
    			append_dev(ul, t13);
    			append_dev(ul, li4);
    			append_dev(li4, a7);
    			append_dev(ul, t15);
    			append_dev(ul, li5);
    			append_dev(li5, a8);
    			append_dev(div20, t17);
    			append_dev(div20, div19);
    			append_dev(div19, div14);
    			append_dev(div14, div13);
    			append_dev(div13, h21);
    			append_dev(div19, t19);
    			append_dev(div19, div16);
    			append_dev(div16, div15);
    			append_dev(div19, t20);
    			append_dev(div19, div18);
    			append_dev(div18, div17);
    			append_dev(div17, p0);
    			append_dev(p0, t21);
    			append_dev(p0, br0);
    			append_dev(p0, t22);
    			append_dev(p0, br1);
    			append_dev(p0, t23);
    			append_dev(div17, t24);
    			append_dev(div17, p1);
    			append_dev(div17, t26);
    			append_dev(div17, p2);
    			append_dev(div27, t28);
    			append_dev(div27, div26);
    			append_dev(div26, div25);
    			append_dev(div25, div22);
    			append_dev(div22, div21);
    			append_dev(div21, p3);
    			append_dev(p3, a9);
    			append_dev(p3, t30);
    			append_dev(p3, a10);
    			append_dev(p3, t32);
    			append_dev(p3, a11);
    			append_dev(p3, t34);
    			append_dev(p3, a12);
    			append_dev(p3, t36);
    			append_dev(p3, a13);
    			append_dev(p3, t38);
    			append_dev(p3, a14);
    			append_dev(div25, t40);
    			append_dev(div25, div24);
    			append_dev(div24, div23);
    			append_dev(div23, p4);
    			append_dev(p4, em0);
    			append_dev(em0, strong0);
    			append_dev(div23, t41);
    			append_dev(div23, p5);
    			append_dev(p5, em1);
    			append_dev(em1, a15);
    			append_dev(a15, strong1);
    			append_dev(a15, t43);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(footer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Footer', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Footer> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Footer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    var title = "Youtube Politics";
    var standfirst = [
    	{
    		type: "text",
    		value: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Commodi consequatur inventore exercitationem ex perferendis provident, earum cumque maiores quam quidem labore, mollitia odit eaque laborum?"
    	}
    ];
    var data = {
    	title: title,
    	standfirst: standfirst,
    	"section-one": {
    	copy: [
    		{
    			type: "text",
    			value: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Excepturi temporibus [1] architecto reprehenderit ipsum harum repellendus consequatur magnam numquam quos dicta sunt cupiditate unde, aperiam [2] delectus debitis ab corrupti hic praesentium?"
    		},
    		{
    			type: "text",
    			value: "Iusto minus quae temporibus deleniti vel exercitationem, repellat recusandae quam totam laboriosam!"
    		}
    	],
    	references: [
    		{
    			type: "text",
    			value: "Iyengar et al, The origins and consequences of affective polarization in the United States, 2019"
    		},
    		{
    			type: "text",
    			value: "Jones, Declining trust in congress: Effects of polarization and consequences for Democracy, 2015"
    		}
    	]
    },
    	"section-two": {
    	copy: [
    		{
    			type: "text",
    			value: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Excepturi temporibus architecto reprehenderit ipsum harum repellendus consequatur magnam numquam quos dicta sunt cupiditate unde, aperiam delectus debitis ab corrupti hic praesentium?"
    		},
    		{
    			type: "text",
    			value: "Cupiditate unde, aperiam delectus debitis ab corrupti hic praesentium?"
    		},
    		{
    			type: "text",
    			value: "Reprehenderit ipsum harum repellendus consequatur magnam. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Excepturi temporibus. Prem ipsum dolor sit, amet consectetur adipisicing elit. Excepturi temporibus architecto architecto."
    		}
    	],
    	references: [
    		{
    			type: "text",
    			value: "Iyengar et al, The origins and consequences of affective polarization in the United States, 2019"
    		},
    		{
    			type: "text",
    			value: "Jones, Declining trust in congress: Effects of polarization and consequences for"
    		},
    		{
    			type: "text",
    			value: "Democracy, 2015"
    		}
    	]
    }
    };

    /* src/App.svelte generated by Svelte v3.49.0 */

    function create_fragment(ctx) {
    	let header;
    	let t;
    	let footer;
    	let current;
    	header = new Header({ $$inline: true });
    	footer = new Footer({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(header.$$.fragment);
    			t = space();
    			create_component(footer.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(header, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(footer, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			transition_in(footer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			transition_out(footer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(header, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(footer, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let { title = 'Your title goes here' } = $$props;
    	let { authors } = $$props;
    	const writable_props = ['title', 'authors'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('authors' in $$props) $$invalidate(1, authors = $$props.authors);
    	};

    	$$self.$capture_state = () => ({ Header, Footer, title, authors });

    	$$self.$inject_state = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('authors' in $$props) $$invalidate(1, authors = $$props.authors);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [title, authors];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { title: 0, authors: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*authors*/ ctx[1] === undefined && !('authors' in props)) {
    			console.warn("<App> was created without expected prop 'authors'");
    		}
    	}

    	get title() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get authors() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set authors(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var authors = [
    	{
    		name: "Homa Hosseinmardia",
    		detail: "Affiliation detail goes here"
    	},
    	{
    		name: "Amir Ghasemianb",
    		detail: "Affiliation detail goes here"
    	},
    	{
    		name: "Aaron Clauset",
    		detail: "Affiliation detail goes here"
    	},
    	{
    		name: "Markus Mobius",
    		detail: "Affiliation detail goes here"
    	},
    	{
    		name: "David M. Rothschildh",
    		detail: "Affiliation detail goes here"
    	},
    	{
    		name: "Duncan J. Watts",
    		detail: "Affiliation detail goes here"
    	}
    ];

    const app = new App({
        target: document.body,
        props: {
            title: data.title,
            authors,
        }
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
