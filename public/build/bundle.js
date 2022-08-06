
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop$1() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
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
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop$1;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
    function set_store_value(store, ret, value) {
        store.set(value);
        return ret;
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop$1;
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
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text$1(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text$1(' ');
    }
    function empty() {
        return text$1('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
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
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
        select.selectedIndex = -1; // no option should be selected
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    // unfortunately this can't be a constant as that wouldn't be tree-shakeable
    // so we cache the result instead
    let crossorigin;
    function is_crossorigin() {
        if (crossorigin === undefined) {
            crossorigin = false;
            try {
                if (typeof window !== 'undefined' && window.parent) {
                    void window.parent.document;
                }
            }
            catch (error) {
                crossorigin = true;
            }
        }
        return crossorigin;
    }
    function add_resize_listener(node, fn) {
        const computed_style = getComputedStyle(node);
        if (computed_style.position === 'static') {
            node.style.position = 'relative';
        }
        const iframe = element('iframe');
        iframe.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; ' +
            'overflow: hidden; border: 0; opacity: 0; pointer-events: none; z-index: -1;');
        iframe.setAttribute('aria-hidden', 'true');
        iframe.tabIndex = -1;
        const crossorigin = is_crossorigin();
        let unsubscribe;
        if (crossorigin) {
            iframe.src = "data:text/html,<script>onresize=function(){parent.postMessage(0,'*')}</script>";
            unsubscribe = listen(window, 'message', (event) => {
                if (event.source === iframe.contentWindow)
                    fn();
            });
        }
        else {
            iframe.src = 'about:blank';
            iframe.onload = () => {
                unsubscribe = listen(iframe.contentWindow, 'resize', fn);
            };
        }
        append(node, iframe);
        return () => {
            if (crossorigin) {
                unsubscribe();
            }
            else if (unsubscribe && iframe.contentWindow) {
                unsubscribe();
            }
            detach(iframe);
        };
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
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
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
        };
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
        return context;
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
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
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
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
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
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

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
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
            update: noop$1,
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
            this.$destroy = noop$1;
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
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
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

    const file$D = "src/components/header/Header.svelte";

    function create_fragment$E(ctx) {
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
    			add_location(img, file$D, 7, 16, 387);
    			attr_dev(a0, "class", "logo_anchor svelte-vklvp2");
    			attr_dev(a0, "href", "https://css.seas.upenn.edu/");
    			add_location(a0, file$D, 6, 12, 312);
    			attr_dev(div0, "class", "logo_container svelte-vklvp2");
    			add_location(div0, file$D, 4, 8, 216);
    			attr_dev(a1, "class", "menu-item-anchor svelte-vklvp2");
    			attr_dev(a1, "href", "https://css.seas.upenn.edu/about/");
    			add_location(a1, file$D, 14, 24, 841);
    			attr_dev(a2, "class", "sub-menu-item-anchor svelte-vklvp2");
    			attr_dev(a2, "href", "https://css.seas.upenn.edu/about/lab/");
    			add_location(a2, file$D, 17, 32, 1111);
    			attr_dev(li0, "class", "menu-item menu-item-type-post_type menu-item-object-page menu-item-1554 svelte-vklvp2");
    			add_location(li0, file$D, 16, 28, 994);
    			attr_dev(a3, "class", "sub-menu-item-anchor svelte-vklvp2");
    			attr_dev(a3, "href", "https://css.seas.upenn.edu/about/community/");
    			add_location(a3, file$D, 20, 32, 1379);
    			attr_dev(li1, "class", "menu-item menu-item-type-post_type menu-item-object-page menu-item-2232 svelte-vklvp2");
    			add_location(li1, file$D, 19, 28, 1262);
    			attr_dev(ul0, "class", "sub-menu svelte-vklvp2");
    			add_location(ul0, file$D, 15, 24, 944);
    			attr_dev(li2, "class", "menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children menu-item-2731 svelte-vklvp2");
    			add_location(li2, file$D, 13, 20, 710);
    			attr_dev(a4, "class", "menu-item-anchor svelte-vklvp2");
    			attr_dev(a4, "href", "https://css.seas.upenn.edu/people/");
    			add_location(a4, file$D, 25, 24, 1699);
    			attr_dev(li3, "class", "menu-item menu-item-type-post_type menu-item-object-page menu-item-1747 svelte-vklvp2");
    			add_location(li3, file$D, 24, 20, 1590);
    			attr_dev(a5, "class", "menu-item-anchor svelte-vklvp2");
    			attr_dev(a5, "href", "https://css.seas.upenn.edu/research/");
    			add_location(a5, file$D, 28, 24, 1956);
    			attr_dev(a6, "class", "sub-menu-item-anchor svelte-vklvp2");
    			attr_dev(a6, "href", "https://css.seas.upenn.edu/project/penn-map/");
    			add_location(a6, file$D, 31, 32, 2230);
    			attr_dev(li4, "class", "menu-item menu-item-type-custom menu-item-object-custom menu-item-735 svelte-vklvp2");
    			add_location(li4, file$D, 30, 28, 2115);
    			attr_dev(a7, "class", "sub-menu-item-anchor svelte-vklvp2");
    			attr_dev(a7, "href", "https://css.seas.upenn.edu/project/virtual-lab/");
    			add_location(a7, file$D, 34, 32, 2503);
    			attr_dev(li5, "class", "menu-item menu-item-type-custom menu-item-object-custom menu-item-292 svelte-vklvp2");
    			add_location(li5, file$D, 33, 28, 2388);
    			attr_dev(a8, "class", "sub-menu-item-anchor svelte-vklvp2");
    			attr_dev(a8, "href", "https://css.seas.upenn.edu/project/covid-philadelphia/");
    			add_location(a8, file$D, 37, 32, 2786);
    			attr_dev(li6, "class", "menu-item menu-item-type-custom menu-item-object-custom menu-item-291 svelte-vklvp2");
    			add_location(li6, file$D, 36, 28, 2671);
    			attr_dev(a9, "class", "sub-menu-item-anchor svelte-vklvp2");
    			attr_dev(a9, "href", "https://css.seas.upenn.edu/project/common-sense/");
    			add_location(a9, file$D, 40, 32, 3080);
    			attr_dev(li7, "class", "menu-item menu-item-type-custom menu-item-object-custom menu-item-377 svelte-vklvp2");
    			add_location(li7, file$D, 39, 28, 2965);
    			attr_dev(ul1, "class", "sub-menu svelte-vklvp2");
    			add_location(ul1, file$D, 29, 24, 2065);
    			attr_dev(li8, "class", "menu-item menu-item-type-post_type menu-item-object-page menu-item-has-children menu-item-37 svelte-vklvp2");
    			add_location(li8, file$D, 27, 20, 1826);
    			attr_dev(a10, "class", "menu-item-anchor svelte-vklvp2");
    			attr_dev(a10, "href", "https://css.seas.upenn.edu/partnerships/");
    			add_location(a10, file$D, 45, 24, 3403);
    			attr_dev(li9, "class", "menu-item menu-item-type-post_type menu-item-object-page menu-item-344 svelte-vklvp2");
    			add_location(li9, file$D, 44, 20, 3295);
    			attr_dev(a11, "class", "menu-item-anchor svelte-vklvp2");
    			attr_dev(a11, "href", "https://css.seas.upenn.edu/publications/");
    			add_location(a11, file$D, 48, 24, 3645);
    			attr_dev(li10, "class", "menu-item menu-item-type-post_type menu-item-object-page menu-item-58 svelte-vklvp2");
    			add_location(li10, file$D, 47, 20, 3538);
    			attr_dev(a12, "class", "menu-item-anchor svelte-vklvp2");
    			attr_dev(a12, "href", "https://css.seas.upenn.edu/blog-news-events/");
    			add_location(a12, file$D, 51, 24, 3892);
    			attr_dev(li11, "class", "menu-item menu-item-type-post_type menu-item-object-page menu-item-105 svelte-vklvp2");
    			add_location(li11, file$D, 50, 20, 3784);
    			attr_dev(ul2, "id", "top-menu");
    			attr_dev(ul2, "class", "nav svelte-vklvp2");
    			add_location(ul2, file$D, 12, 16, 659);
    			attr_dev(nav, "id", "top-menu-nav");
    			add_location(nav, file$D, 11, 12, 619);
    			attr_dev(div1, "id", "et-top-navigation");
    			add_location(div1, file$D, 10, 8, 578);
    			attr_dev(div2, "class", "container clearfix et_menu_container svelte-vklvp2");
    			add_location(div2, file$D, 3, 4, 157);
    			attr_dev(header, "id", "main-header");
    			attr_dev(header, "data-height-onload", "84");
    			attr_dev(header, "data-height-loaded", "true");
    			attr_dev(header, "data-fixed-height-onload", "84");
    			set_style(header, "top", "0px");
    			attr_dev(header, "class", "svelte-vklvp2");
    			add_location(header, file$D, 2, 0, 29);
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
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$E.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$E($$self, $$props) {
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
    		init(this, options, instance$E, create_fragment$E, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$E.name
    		});
    	}
    }

    /* src/components/footer/Footer.svelte generated by Svelte v3.49.0 */

    const file$C = "src/components/footer/Footer.svelte";

    function create_fragment$D(ctx) {
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
    			t21 = text$1("3401 Walnut Street");
    			br0 = element("br");
    			t22 = text$1("Suite 417B");
    			br1 = element("br");
    			t23 = text$1("Philadelphia PA, 19104");
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
    			t43 = text$1(" Click here to view opportunities for Penn students");
    			attr_dev(img0, "loading", "lazy");
    			attr_dev(img0, "width", "480");
    			attr_dev(img0, "height", "123");
    			if (!src_url_equal(img0.src, img0_src_value = "https://css.seas.upenn.edu/wp-content/uploads/2022/04/newfooter-1-seas.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "Penn Engineering");
    			attr_dev(img0, "title", "Penn Engineering");
    			attr_dev(img0, "srcset", "https://css.seas.upenn.edu/wp-content/uploads/2022/04/newfooter-1-seas.png 480w, https://css.seas.upenn.edu/wp-content/uploads/2022/04/newfooter-1-seas-300x77.png 300w");
    			attr_dev(img0, "sizes", "(max-width: 480px) 100vw, 480px");
    			attr_dev(img0, "class", "wp-image-3438 svelte-11jfbp5");
    			add_location(img0, file$C, 10, 32, 784);
    			attr_dev(span0, "class", "et_pb_image_wrap  svelte-11jfbp5");
    			add_location(span0, file$C, 9, 28, 719);
    			attr_dev(a0, "href", "https://www.seas.upenn.edu/");
    			attr_dev(a0, "target", "_blank");
    			attr_dev(a0, "class", "svelte-11jfbp5");
    			add_location(a0, file$C, 8, 24, 636);
    			attr_dev(div0, "class", "et_pb_module et_pb_image et_pb_image_0_tb_footer et_pb_image_sticky svelte-11jfbp5");
    			add_location(div0, file$C, 7, 20, 530);
    			attr_dev(img1, "loading", "lazy");
    			attr_dev(img1, "width", "480");
    			attr_dev(img1, "height", "123");
    			if (!src_url_equal(img1.src, img1_src_value = "https://css.seas.upenn.edu/wp-content/uploads/2022/04/newfooter-2-asc.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "Penn Engineering");
    			attr_dev(img1, "title", "Penn Engineering");
    			attr_dev(img1, "srcset", "https://css.seas.upenn.edu/wp-content/uploads/2022/04/newfooter-2-asc.png 480w, https://css.seas.upenn.edu/wp-content/uploads/2022/04/newfooter-2-asc-300x77.png 300w");
    			attr_dev(img1, "sizes", "(max-width: 480px) 100vw, 480px");
    			attr_dev(img1, "class", "wp-image-3440 svelte-11jfbp5");
    			add_location(img1, file$C, 26, 32, 1897);
    			attr_dev(span1, "class", "et_pb_image_wrap  svelte-11jfbp5");
    			add_location(span1, file$C, 25, 28, 1832);
    			attr_dev(a1, "href", "https://www.asc.upenn.edu/");
    			attr_dev(a1, "target", "_blank");
    			attr_dev(a1, "class", "svelte-11jfbp5");
    			add_location(a1, file$C, 24, 24, 1750);
    			attr_dev(div1, "class", "et_pb_module et_pb_image et_pb_image_1_tb_footer et_pb_image_sticky svelte-11jfbp5");
    			add_location(div1, file$C, 23, 20, 1644);
    			attr_dev(img2, "loading", "lazy");
    			attr_dev(img2, "width", "480");
    			attr_dev(img2, "height", "111");
    			if (!src_url_equal(img2.src, img2_src_value = "https://css.seas.upenn.edu/wp-content/uploads/2022/04/newfooter-3-wharton.png")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "Penn Engineering");
    			attr_dev(img2, "title", "Penn Engineering");
    			attr_dev(img2, "srcset", "https://css.seas.upenn.edu/wp-content/uploads/2022/04/newfooter-3-wharton.png 480w, https://css.seas.upenn.edu/wp-content/uploads/2022/04/newfooter-3-wharton-300x69.png 300w");
    			attr_dev(img2, "sizes", "(max-width: 480px) 100vw, 480px");
    			attr_dev(img2, "class", "wp-image-3439 svelte-11jfbp5");
    			add_location(img2, file$C, 42, 32, 3003);
    			attr_dev(span2, "class", "et_pb_image_wrap  svelte-11jfbp5");
    			add_location(span2, file$C, 41, 28, 2938);
    			attr_dev(a2, "href", "https://www.wharton.upenn.edu/");
    			attr_dev(a2, "target", "_blank");
    			attr_dev(a2, "class", "svelte-11jfbp5");
    			add_location(a2, file$C, 40, 24, 2852);
    			attr_dev(div2, "class", "et_pb_module et_pb_image et_pb_image_2_tb_footer et_pb_image_sticky svelte-11jfbp5");
    			add_location(div2, file$C, 39, 20, 2746);
    			attr_dev(div3, "class", "et_pb_column et_pb_column_1_4 et_pb_column_0_tb_footer global-footer-column-1 et_pb_css_mix_blend_mode_passthrough svelte-11jfbp5");
    			add_location(div3, file$C, 6, 16, 380);
    			attr_dev(h20, "class", "svelte-11jfbp5");
    			add_location(h20, file$C, 60, 24, 4229);
    			attr_dev(div4, "class", "et_pb_text_inner svelte-11jfbp5");
    			add_location(div4, file$C, 59, 20, 4174);
    			attr_dev(div5, "class", "et_pb_module et_pb_text et_pb_text_0_tb_footer et_pb_text_align_left et_pb_bg_layout_light svelte-11jfbp5");
    			add_location(div5, file$C, 58, 16, 4048);
    			attr_dev(div6, "class", "et_pb_divider_internal svelte-11jfbp5");
    			add_location(div6, file$C, 64, 20, 4436);
    			attr_dev(div7, "class", "et_pb_module et_pb_divider et_pb_divider_0_tb_footer et_pb_divider_position_ et_pb_space svelte-11jfbp5");
    			add_location(div7, file$C, 63, 16, 4313);
    			attr_dev(a3, "href", "https://css.seas.upenn.edu/about/");
    			attr_dev(a3, "class", "svelte-11jfbp5");
    			add_location(a3, file$C, 73, 44, 5270);
    			attr_dev(li0, "id", "menu-item-3425");
    			attr_dev(li0, "class", "et_pb_menu_page_id-2233 menu-item menu-item-type-post_type menu-item-object-page menu-item-3425 svelte-11jfbp5");
    			add_location(li0, file$C, 72, 40, 5097);
    			attr_dev(a4, "href", "https://css.seas.upenn.edu/people/");
    			attr_dev(a4, "class", "svelte-11jfbp5");
    			add_location(a4, file$C, 76, 44, 5583);
    			attr_dev(li1, "id", "menu-item-3426");
    			attr_dev(li1, "class", "et_pb_menu_page_id-1732 menu-item menu-item-type-post_type menu-item-object-page menu-item-3426 svelte-11jfbp5");
    			add_location(li1, file$C, 75, 40, 5410);
    			attr_dev(a5, "href", "https://css.seas.upenn.edu/research/");
    			attr_dev(a5, "class", "svelte-11jfbp5");
    			add_location(a5, file$C, 79, 44, 5896);
    			attr_dev(li2, "id", "menu-item-3430");
    			attr_dev(li2, "class", "et_pb_menu_page_id-22 menu-item menu-item-type-post_type menu-item-object-page menu-item-3430 svelte-11jfbp5");
    			add_location(li2, file$C, 78, 40, 5725);
    			attr_dev(a6, "href", "https://css.seas.upenn.edu/partnerships/");
    			attr_dev(a6, "class", "svelte-11jfbp5");
    			add_location(a6, file$C, 82, 44, 6213);
    			attr_dev(li3, "id", "menu-item-3428");
    			attr_dev(li3, "class", "et_pb_menu_page_id-65 menu-item menu-item-type-post_type menu-item-object-page menu-item-3428 svelte-11jfbp5");
    			add_location(li3, file$C, 81, 40, 6042);
    			attr_dev(a7, "href", "https://css.seas.upenn.edu/publications/");
    			attr_dev(a7, "class", "svelte-11jfbp5");
    			add_location(a7, file$C, 85, 44, 6534);
    			attr_dev(li4, "id", "menu-item-3429");
    			attr_dev(li4, "class", "et_pb_menu_page_id-52 menu-item menu-item-type-post_type menu-item-object-page menu-item-3429 svelte-11jfbp5");
    			add_location(li4, file$C, 84, 40, 6363);
    			attr_dev(a8, "href", "https://css.seas.upenn.edu/blog-news-events/");
    			attr_dev(a8, "class", "svelte-11jfbp5");
    			add_location(a8, file$C, 88, 44, 6859);
    			attr_dev(li5, "id", "menu-item-3427");
    			attr_dev(li5, "class", "et_pb_menu_page_id-92 menu-item menu-item-type-post_type menu-item-object-page menu-item-3427 svelte-11jfbp5");
    			add_location(li5, file$C, 87, 40, 6688);
    			attr_dev(ul, "id", "menu-footer-menu-new");
    			attr_dev(ul, "class", "et-menu nav svelte-11jfbp5");
    			add_location(ul, file$C, 71, 36, 5006);
    			attr_dev(nav, "class", "et-menu-nav svelte-11jfbp5");
    			add_location(nav, file$C, 70, 32, 4944);
    			attr_dev(div8, "class", "et_pb_menu__menu svelte-11jfbp5");
    			add_location(div8, file$C, 69, 28, 4881);
    			attr_dev(div9, "class", "et_pb_menu__wrap");
    			add_location(div9, file$C, 68, 24, 4822);
    			attr_dev(div10, "class", "et_pb_menu_inner_container clearfix");
    			add_location(div10, file$C, 67, 20, 4748);
    			attr_dev(div11, "class", "et_pb_module et_pb_menu et_pb_menu_0_tb_footer footer-vertical-menu et_pb_bg_layout_light et_pb_text_align_left et_dropdown_animation_fade et_pb_menu--without-logo et_pb_menu--style-left_aligned svelte-11jfbp5");
    			add_location(div11, file$C, 66, 16, 4518);
    			attr_dev(div12, "class", "et_pb_column et_pb_column_1_4 et_pb_column_1_tb_footer global-footer-column-2 et_pb_css_mix_blend_mode_passthrough et_pb_column--with-menu svelte-11jfbp5");
    			add_location(div12, file$C, 57, 12, 3878);
    			attr_dev(h21, "class", "svelte-11jfbp5");
    			add_location(h21, file$C, 101, 16, 7497);
    			attr_dev(div13, "class", "et_pb_text_inner svelte-11jfbp5");
    			add_location(div13, file$C, 100, 12, 7450);
    			attr_dev(div14, "class", "et_pb_module et_pb_text et_pb_text_1_tb_footer et_pb_text_align_left et_pb_bg_layout_light svelte-11jfbp5");
    			add_location(div14, file$C, 99, 8, 7332);
    			attr_dev(div15, "class", "et_pb_divider_internal svelte-11jfbp5");
    			add_location(div15, file$C, 105, 12, 7671);
    			attr_dev(div16, "class", "et_pb_module et_pb_divider et_pb_divider_1_tb_footer et_pb_divider_position_ et_pb_space svelte-11jfbp5");
    			add_location(div16, file$C, 104, 8, 7556);
    			add_location(br0, file$C, 109, 37, 7923);
    			add_location(br1, file$C, 109, 51, 7937);
    			attr_dev(p0, "class", "svelte-11jfbp5");
    			add_location(p0, file$C, 109, 16, 7902);
    			attr_dev(p1, "class", "svelte-11jfbp5");
    			add_location(p1, file$C, 110, 16, 7984);
    			attr_dev(p2, "class", "svelte-11jfbp5");
    			add_location(p2, file$C, 111, 16, 8029);
    			attr_dev(div17, "class", "et_pb_text_inner svelte-11jfbp5");
    			add_location(div17, file$C, 108, 12, 7855);
    			attr_dev(div18, "class", "et_pb_module et_pb_text et_pb_text_2_tb_footer et_pb_text_align_left et_pb_bg_layout_light svelte-11jfbp5");
    			add_location(div18, file$C, 107, 8, 7737);
    			attr_dev(div19, "class", "et_pb_column et_pb_column_1_4 et_pb_column_2_tb_footer global-footer-column-3 et_pb_css_mix_blend_mode_passthrough svelte-11jfbp5");
    			add_location(div19, file$C, 98, 4, 7194);
    			attr_dev(div20, "class", "et_pb_row et_pb_row_0_tb_footer et_pb_row--with-menu et_pb_row_4col svelte-11jfbp5");
    			set_style(div20, "z-index", "3");
    			add_location(div20, file$C, 5, 12, 262);
    			attr_dev(a9, "href", "https://www.upenn.edu/");
    			attr_dev(a9, "class", "svelte-11jfbp5");
    			add_location(a9, file$C, 134, 24, 9569);
    			attr_dev(a10, "href", "https://www.upenn.edu/about/disclaimer");
    			attr_dev(a10, "class", "svelte-11jfbp5");
    			add_location(a10, file$C, 135, 24, 9644);
    			attr_dev(a11, "href", "https://www.publicsafety.upenn.edu/contact/");
    			attr_dev(a11, "class", "svelte-11jfbp5");
    			add_location(a11, file$C, 136, 24, 9732);
    			attr_dev(a12, "href", "https://www.upenn.edu/about/privacy-policy");
    			attr_dev(a12, "class", "svelte-11jfbp5");
    			add_location(a12, file$C, 137, 24, 9833);
    			attr_dev(a13, "href", "https://accessibility.web-resources.upenn.edu/get-help");
    			attr_dev(a13, "class", "svelte-11jfbp5");
    			add_location(a13, file$C, 138, 24, 9929);
    			attr_dev(a14, "href", "https://www.upenn.edu/about/report-copyright-infringement");
    			attr_dev(a14, "class", "svelte-11jfbp5");
    			add_location(a14, file$C, 139, 24, 10063);
    			set_style(p3, "text-align", "center");
    			attr_dev(p3, "class", "svelte-11jfbp5");
    			add_location(p3, file$C, 133, 20, 9513);
    			attr_dev(div21, "class", "et_pb_text_inner svelte-11jfbp5");
    			add_location(div21, file$C, 132, 16, 9462);
    			attr_dev(div22, "class", "et_pb_module et_pb_text et_pb_text_4_tb_footer et_pb_text_align_left et_pb_bg_layout_light svelte-11jfbp5");
    			add_location(div22, file$C, 131, 12, 9340);
    			add_location(strong0, file$C, 145, 55, 10452);
    			add_location(em0, file$C, 145, 51, 10448);
    			set_style(p4, "text-align", "center");
    			attr_dev(p4, "class", "svelte-11jfbp5");
    			add_location(p4, file$C, 145, 20, 10417);
    			add_location(strong1, file$C, 146, 122, 10601);
    			attr_dev(a15, "href", "https://css.seas.upenn.edu/research-assistant-positions/");
    			attr_dev(a15, "class", "svelte-11jfbp5");
    			add_location(a15, file$C, 146, 55, 10534);
    			add_location(em1, file$C, 146, 51, 10530);
    			set_style(p5, "text-align", "center");
    			attr_dev(p5, "class", "svelte-11jfbp5");
    			add_location(p5, file$C, 146, 20, 10499);
    			attr_dev(div23, "class", "et_pb_text_inner svelte-11jfbp5");
    			add_location(div23, file$C, 144, 16, 10366);
    			attr_dev(div24, "class", "et_pb_module et_pb_text et_pb_text_5_tb_footer et_pb_text_align_left et_pb_bg_layout_light svelte-11jfbp5");
    			add_location(div24, file$C, 143, 12, 10244);
    			attr_dev(div25, "class", "et_pb_column et_pb_column_4_4 et_pb_column_4_tb_footer et_pb_css_mix_blend_mode_passthrough et-last-child");
    			add_location(div25, file$C, 130, 8, 9207);
    			attr_dev(div26, "class", "et_pb_row et_pb_row_1_tb_footer et_pb_equal_columns svelte-11jfbp5");
    			add_location(div26, file$C, 129, 4, 9133);
    			attr_dev(div27, "class", "et_pb_section et_pb_section_0_tb_footer et_pb_with_background et_section_regular et_pb_section--with-menu svelte-11jfbp5");
    			add_location(div27, file$C, 4, 8, 130);
    			attr_dev(div28, "class", "et_builder_inner_content et_pb_gutters3");
    			add_location(div28, file$C, 3, 4, 68);
    			attr_dev(footer, "class", "et-l et-l--footer svelte-11jfbp5");
    			add_location(footer, file$C, 2, 0, 29);
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
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(footer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$D.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$D($$self, $$props) {
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
    		init(this, options, instance$D, create_fragment$D, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment$D.name
    		});
    	}
    }

    /* src/components/copy/Title.svelte generated by Svelte v3.49.0 */

    const file$B = "src/components/copy/Title.svelte";

    function create_fragment$C(ctx) {
    	let h1;
    	let t;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			t = text$1(/*title*/ ctx[0]);
    			attr_dev(h1, "class", "svelte-8vtzvs");
    			add_location(h1, file$B, 3, 0, 47);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			append_dev(h1, t);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*title*/ 1) set_data_dev(t, /*title*/ ctx[0]);
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$C.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$C($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Title', slots, []);
    	let { title } = $$props;
    	const writable_props = ['title'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Title> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    	};

    	$$self.$capture_state = () => ({ title });

    	$$self.$inject_state = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [title];
    }

    class Title extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$C, create_fragment$C, safe_not_equal, { title: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Title",
    			options,
    			id: create_fragment$C.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*title*/ ctx[0] === undefined && !('title' in props)) {
    			console.warn("<Title> was created without expected prop 'title'");
    		}
    	}

    	get title() {
    		throw new Error("<Title>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Title>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/copy/Description.svelte generated by Svelte v3.49.0 */

    const file$A = "src/components/copy/Description.svelte";

    function create_fragment$B(ctx) {
    	let p;
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text$1(/*text*/ ctx[0]);
    			attr_dev(p, "class", "svelte-1pqfof3");
    			add_location(p, file$A, 3, 0, 46);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*text*/ 1) set_data_dev(t, /*text*/ ctx[0]);
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$B.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$B($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Description', slots, []);
    	let { text } = $$props;
    	const writable_props = ['text'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Description> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('text' in $$props) $$invalidate(0, text = $$props.text);
    	};

    	$$self.$capture_state = () => ({ text });

    	$$self.$inject_state = $$props => {
    		if ('text' in $$props) $$invalidate(0, text = $$props.text);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [text];
    }

    class Description extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$B, create_fragment$B, safe_not_equal, { text: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Description",
    			options,
    			id: create_fragment$B.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*text*/ ctx[0] === undefined && !('text' in props)) {
    			console.warn("<Description> was created without expected prop 'text'");
    		}
    	}

    	get text() {
    		throw new Error("<Description>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<Description>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/copy/Authors.svelte generated by Svelte v3.49.0 */

    const file$z = "src/components/copy/Authors.svelte";

    function get_each_context$m(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	child_ctx[3] = i;
    	return child_ctx;
    }

    function get_each_context_1$c(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (22:5) {#each author.detail as aff}
    function create_each_block_1$c(ctx) {
    	let p;
    	let t_value = /*aff*/ ctx[4] + "";
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text$1(t_value);
    			attr_dev(p, "class", "detail-list-value svelte-j5brtz");
    			add_location(p, file$z, 22, 6, 545);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*authors*/ 1 && t_value !== (t_value = /*aff*/ ctx[4] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$c.name,
    		type: "each",
    		source: "(22:5) {#each author.detail as aff}",
    		ctx
    	});

    	return block;
    }

    // (11:1) {#each authors as author, i}
    function create_each_block$m(ctx) {
    	let div2;
    	let p;
    	let t0_value = /*author*/ ctx[1].name + "";
    	let t0;
    	let t1;
    	let div1;
    	let div0;
    	let t2;
    	let mounted;
    	let dispose;
    	let each_value_1 = /*author*/ ctx[1].detail;
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$c(get_each_context_1$c(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			p = element("p");
    			t0 = text$1(t0_value);
    			t1 = space();
    			div1 = element("div");
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			attr_dev(p, "class", "author-name svelte-j5brtz");
    			add_location(p, file$z, 18, 3, 410);
    			attr_dev(div0, "class", "detail-list svelte-j5brtz");
    			add_location(div0, file$z, 20, 4, 479);
    			attr_dev(div1, "class", "detail svelte-j5brtz");
    			add_location(div1, file$z, 19, 3, 454);
    			attr_dev(div2, "class", "author-container svelte-j5brtz");
    			add_location(div2, file$z, 11, 2, 245);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, p);
    			append_dev(p, t0);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			append_dev(div2, t2);

    			if (!mounted) {
    				dispose = [
    					listen_dev(div2, "mouseover", handleMouseOver, false, false, false),
    					listen_dev(div2, "focus", handleMouseOver, false, false, false),
    					listen_dev(div2, "mouseout", handleMouseOut, false, false, false),
    					listen_dev(div2, "blur", handleMouseOut, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*authors*/ 1 && t0_value !== (t0_value = /*author*/ ctx[1].name + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*authors*/ 1) {
    				each_value_1 = /*author*/ ctx[1].detail;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$c(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$c(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$m.name,
    		type: "each",
    		source: "(11:1) {#each authors as author, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$A(ctx) {
    	let div;
    	let each_value = /*authors*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$m(get_each_context$m(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "authors svelte-j5brtz");
    			add_location(div, file$z, 9, 0, 191);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*handleMouseOver, handleMouseOut, authors*/ 1) {
    				each_value = /*authors*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$m(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$m(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$A.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function handleMouseOver(e) {
    	e.target.classList.add('active');
    }

    function handleMouseOut(e) {
    	e.target.classList.remove('active');
    }

    function instance$A($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Authors', slots, []);
    	let { authors } = $$props;
    	const writable_props = ['authors'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Authors> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('authors' in $$props) $$invalidate(0, authors = $$props.authors);
    	};

    	$$self.$capture_state = () => ({ authors, handleMouseOver, handleMouseOut });

    	$$self.$inject_state = $$props => {
    		if ('authors' in $$props) $$invalidate(0, authors = $$props.authors);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [authors];
    }

    class Authors extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$A, create_fragment$A, safe_not_equal, { authors: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Authors",
    			options,
    			id: create_fragment$A.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*authors*/ ctx[0] === undefined && !('authors' in props)) {
    			console.warn("<Authors> was created without expected prop 'authors'");
    		}
    	}

    	get authors() {
    		throw new Error("<Authors>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set authors(value) {
    		throw new Error("<Authors>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var EOL = {},
        EOF = {},
        QUOTE = 34,
        NEWLINE = 10,
        RETURN = 13;

    function objectConverter(columns) {
      return new Function("d", "return {" + columns.map(function(name, i) {
        return JSON.stringify(name) + ": d[" + i + "] || \"\"";
      }).join(",") + "}");
    }

    function customConverter(columns, f) {
      var object = objectConverter(columns);
      return function(row, i) {
        return f(object(row), i, columns);
      };
    }

    // Compute unique columns in order of discovery.
    function inferColumns(rows) {
      var columnSet = Object.create(null),
          columns = [];

      rows.forEach(function(row) {
        for (var column in row) {
          if (!(column in columnSet)) {
            columns.push(columnSet[column] = column);
          }
        }
      });

      return columns;
    }

    function pad$1(value, width) {
      var s = value + "", length = s.length;
      return length < width ? new Array(width - length + 1).join(0) + s : s;
    }

    function formatYear$1(year) {
      return year < 0 ? "-" + pad$1(-year, 6)
        : year > 9999 ? "+" + pad$1(year, 6)
        : pad$1(year, 4);
    }

    function formatDate(date) {
      var hours = date.getUTCHours(),
          minutes = date.getUTCMinutes(),
          seconds = date.getUTCSeconds(),
          milliseconds = date.getUTCMilliseconds();
      return isNaN(date) ? "Invalid Date"
          : formatYear$1(date.getUTCFullYear()) + "-" + pad$1(date.getUTCMonth() + 1, 2) + "-" + pad$1(date.getUTCDate(), 2)
          + (milliseconds ? "T" + pad$1(hours, 2) + ":" + pad$1(minutes, 2) + ":" + pad$1(seconds, 2) + "." + pad$1(milliseconds, 3) + "Z"
          : seconds ? "T" + pad$1(hours, 2) + ":" + pad$1(minutes, 2) + ":" + pad$1(seconds, 2) + "Z"
          : minutes || hours ? "T" + pad$1(hours, 2) + ":" + pad$1(minutes, 2) + "Z"
          : "");
    }

    function dsvFormat(delimiter) {
      var reFormat = new RegExp("[\"" + delimiter + "\n\r]"),
          DELIMITER = delimiter.charCodeAt(0);

      function parse(text, f) {
        var convert, columns, rows = parseRows(text, function(row, i) {
          if (convert) return convert(row, i - 1);
          columns = row, convert = f ? customConverter(row, f) : objectConverter(row);
        });
        rows.columns = columns || [];
        return rows;
      }

      function parseRows(text, f) {
        var rows = [], // output rows
            N = text.length,
            I = 0, // current character index
            n = 0, // current line number
            t, // current token
            eof = N <= 0, // current token followed by EOF?
            eol = false; // current token followed by EOL?

        // Strip the trailing newline.
        if (text.charCodeAt(N - 1) === NEWLINE) --N;
        if (text.charCodeAt(N - 1) === RETURN) --N;

        function token() {
          if (eof) return EOF;
          if (eol) return eol = false, EOL;

          // Unescape quotes.
          var i, j = I, c;
          if (text.charCodeAt(j) === QUOTE) {
            while (I++ < N && text.charCodeAt(I) !== QUOTE || text.charCodeAt(++I) === QUOTE);
            if ((i = I) >= N) eof = true;
            else if ((c = text.charCodeAt(I++)) === NEWLINE) eol = true;
            else if (c === RETURN) { eol = true; if (text.charCodeAt(I) === NEWLINE) ++I; }
            return text.slice(j + 1, i - 1).replace(/""/g, "\"");
          }

          // Find next delimiter or newline.
          while (I < N) {
            if ((c = text.charCodeAt(i = I++)) === NEWLINE) eol = true;
            else if (c === RETURN) { eol = true; if (text.charCodeAt(I) === NEWLINE) ++I; }
            else if (c !== DELIMITER) continue;
            return text.slice(j, i);
          }

          // Return last token before EOF.
          return eof = true, text.slice(j, N);
        }

        while ((t = token()) !== EOF) {
          var row = [];
          while (t !== EOL && t !== EOF) row.push(t), t = token();
          if (f && (row = f(row, n++)) == null) continue;
          rows.push(row);
        }

        return rows;
      }

      function preformatBody(rows, columns) {
        return rows.map(function(row) {
          return columns.map(function(column) {
            return formatValue(row[column]);
          }).join(delimiter);
        });
      }

      function format(rows, columns) {
        if (columns == null) columns = inferColumns(rows);
        return [columns.map(formatValue).join(delimiter)].concat(preformatBody(rows, columns)).join("\n");
      }

      function formatBody(rows, columns) {
        if (columns == null) columns = inferColumns(rows);
        return preformatBody(rows, columns).join("\n");
      }

      function formatRows(rows) {
        return rows.map(formatRow).join("\n");
      }

      function formatRow(row) {
        return row.map(formatValue).join(delimiter);
      }

      function formatValue(value) {
        return value == null ? ""
            : value instanceof Date ? formatDate(value)
            : reFormat.test(value += "") ? "\"" + value.replace(/"/g, "\"\"") + "\""
            : value;
      }

      return {
        parse: parse,
        parseRows: parseRows,
        format: format,
        formatBody: formatBody,
        formatRows: formatRows,
        formatRow: formatRow,
        formatValue: formatValue
      };
    }

    var csv$1 = dsvFormat(",");

    var csvParse = csv$1.parse;

    function autoType(object) {
      for (var key in object) {
        var value = object[key].trim(), number, m;
        if (!value) value = null;
        else if (value === "true") value = true;
        else if (value === "false") value = false;
        else if (value === "NaN") value = NaN;
        else if (!isNaN(number = +value)) value = number;
        else if (m = value.match(/^([-+]\d{2})?\d{4}(-\d{2}(-\d{2})?)?(T\d{2}:\d{2}(:\d{2}(\.\d{3})?)?(Z|[-+]\d{2}:\d{2})?)?$/)) {
          if (fixtz && !!m[4] && !m[7]) value = value.replace(/-/g, "/").replace(/T/, " ");
          value = new Date(value);
        }
        else continue;
        object[key] = value;
      }
      return object;
    }

    // https://github.com/d3/d3-dsv/issues/45
    const fixtz = new Date("2019-01-01T00:00").getHours() || new Date("2019-07-01T00:00").getHours();

    function responseText(response) {
      if (!response.ok) throw new Error(response.status + " " + response.statusText);
      return response.text();
    }

    function text(input, init) {
      return fetch(input, init).then(responseText);
    }

    function dsvParse(parse) {
      return function(input, init, row) {
        if (arguments.length === 2 && typeof init === "function") row = init, init = undefined;
        return text(input, init).then(function(response) {
          return parse(response, row);
        });
      };
    }

    var csv = dsvParse(csvParse);

    function ascending(a, b) {
      return a == null || b == null ? NaN : a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
    }

    function descending(a, b) {
      return a == null || b == null ? NaN
        : b < a ? -1
        : b > a ? 1
        : b >= a ? 0
        : NaN;
    }

    function bisector(f) {
      let compare1, compare2, delta;

      // If an accessor is specified, promote it to a comparator. In this case we
      // can test whether the search value is (self-) comparable. We can’t do this
      // for a comparator (except for specific, known comparators) because we can’t
      // tell if the comparator is symmetric, and an asymmetric comparator can’t be
      // used to test whether a single value is comparable.
      if (f.length !== 2) {
        compare1 = ascending;
        compare2 = (d, x) => ascending(f(d), x);
        delta = (d, x) => f(d) - x;
      } else {
        compare1 = f === ascending || f === descending ? f : zero$1;
        compare2 = f;
        delta = f;
      }

      function left(a, x, lo = 0, hi = a.length) {
        if (lo < hi) {
          if (compare1(x, x) !== 0) return hi;
          do {
            const mid = (lo + hi) >>> 1;
            if (compare2(a[mid], x) < 0) lo = mid + 1;
            else hi = mid;
          } while (lo < hi);
        }
        return lo;
      }

      function right(a, x, lo = 0, hi = a.length) {
        if (lo < hi) {
          if (compare1(x, x) !== 0) return hi;
          do {
            const mid = (lo + hi) >>> 1;
            if (compare2(a[mid], x) <= 0) lo = mid + 1;
            else hi = mid;
          } while (lo < hi);
        }
        return lo;
      }

      function center(a, x, lo = 0, hi = a.length) {
        const i = left(a, x, lo, hi - 1);
        return i > lo && delta(a[i - 1], x) > -delta(a[i], x) ? i - 1 : i;
      }

      return {left, center, right};
    }

    function zero$1() {
      return 0;
    }

    function number$2(x) {
      return x === null ? NaN : +x;
    }

    const ascendingBisect = bisector(ascending);
    const bisectRight = ascendingBisect.right;
    bisector(number$2).center;
    var bisect = bisectRight;

    function extent(values, valueof) {
      let min;
      let max;
      if (valueof === undefined) {
        for (const value of values) {
          if (value != null) {
            if (min === undefined) {
              if (value >= value) min = max = value;
            } else {
              if (min > value) min = value;
              if (max < value) max = value;
            }
          }
        }
      } else {
        let index = -1;
        for (let value of values) {
          if ((value = valueof(value, ++index, values)) != null) {
            if (min === undefined) {
              if (value >= value) min = max = value;
            } else {
              if (min > value) min = value;
              if (max < value) max = value;
            }
          }
        }
      }
      return [min, max];
    }

    class InternMap extends Map {
      constructor(entries, key = keyof) {
        super();
        Object.defineProperties(this, {_intern: {value: new Map()}, _key: {value: key}});
        if (entries != null) for (const [key, value] of entries) this.set(key, value);
      }
      get(key) {
        return super.get(intern_get(this, key));
      }
      has(key) {
        return super.has(intern_get(this, key));
      }
      set(key, value) {
        return super.set(intern_set(this, key), value);
      }
      delete(key) {
        return super.delete(intern_delete(this, key));
      }
    }

    function intern_get({_intern, _key}, value) {
      const key = _key(value);
      return _intern.has(key) ? _intern.get(key) : value;
    }

    function intern_set({_intern, _key}, value) {
      const key = _key(value);
      if (_intern.has(key)) return _intern.get(key);
      _intern.set(key, value);
      return value;
    }

    function intern_delete({_intern, _key}, value) {
      const key = _key(value);
      if (_intern.has(key)) {
        value = _intern.get(key);
        _intern.delete(key);
      }
      return value;
    }

    function keyof(value) {
      return value !== null && typeof value === "object" ? value.valueOf() : value;
    }

    function identity$3(x) {
      return x;
    }

    function group(values, ...keys) {
      return nest(values, identity$3, identity$3, keys);
    }

    function groups(values, ...keys) {
      return nest(values, Array.from, identity$3, keys);
    }

    function nest(values, map, reduce, keys) {
      return (function regroup(values, i) {
        if (i >= keys.length) return reduce(values);
        const groups = new InternMap();
        const keyof = keys[i++];
        let index = -1;
        for (const value of values) {
          const key = keyof(value, ++index, values);
          const group = groups.get(key);
          if (group) group.push(value);
          else groups.set(key, [value]);
        }
        for (const [key, values] of groups) {
          groups.set(key, regroup(values, i));
        }
        return map(groups);
      })(values, 0);
    }

    var e10 = Math.sqrt(50),
        e5 = Math.sqrt(10),
        e2 = Math.sqrt(2);

    function ticks(start, stop, count) {
      var reverse,
          i = -1,
          n,
          ticks,
          step;

      stop = +stop, start = +start, count = +count;
      if (start === stop && count > 0) return [start];
      if (reverse = stop < start) n = start, start = stop, stop = n;
      if ((step = tickIncrement(start, stop, count)) === 0 || !isFinite(step)) return [];

      if (step > 0) {
        let r0 = Math.round(start / step), r1 = Math.round(stop / step);
        if (r0 * step < start) ++r0;
        if (r1 * step > stop) --r1;
        ticks = new Array(n = r1 - r0 + 1);
        while (++i < n) ticks[i] = (r0 + i) * step;
      } else {
        step = -step;
        let r0 = Math.round(start * step), r1 = Math.round(stop * step);
        if (r0 / step < start) ++r0;
        if (r1 / step > stop) --r1;
        ticks = new Array(n = r1 - r0 + 1);
        while (++i < n) ticks[i] = (r0 + i) / step;
      }

      if (reverse) ticks.reverse();

      return ticks;
    }

    function tickIncrement(start, stop, count) {
      var step = (stop - start) / Math.max(0, count),
          power = Math.floor(Math.log(step) / Math.LN10),
          error = step / Math.pow(10, power);
      return power >= 0
          ? (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1) * Math.pow(10, power)
          : -Math.pow(10, -power) / (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1);
    }

    function tickStep(start, stop, count) {
      var step0 = Math.abs(stop - start) / Math.max(0, count),
          step1 = Math.pow(10, Math.floor(Math.log(step0) / Math.LN10)),
          error = step0 / step1;
      if (error >= e10) step1 *= 10;
      else if (error >= e5) step1 *= 5;
      else if (error >= e2) step1 *= 2;
      return stop < start ? -step1 : step1;
    }

    function range(start, stop, step) {
      start = +start, stop = +stop, step = (n = arguments.length) < 2 ? (stop = start, start = 0, 1) : n < 3 ? 1 : +step;

      var i = -1,
          n = Math.max(0, Math.ceil((stop - start) / step)) | 0,
          range = new Array(n);

      while (++i < n) {
        range[i] = start + i * step;
      }

      return range;
    }

    function sum(values, valueof) {
      let sum = 0;
      if (valueof === undefined) {
        for (let value of values) {
          if (value = +value) {
            sum += value;
          }
        }
      } else {
        let index = -1;
        for (let value of values) {
          if (value = +valueof(value, ++index, values)) {
            sum += value;
          }
        }
      }
      return sum;
    }

    function initRange(domain, range) {
      switch (arguments.length) {
        case 0: break;
        case 1: this.range(domain); break;
        default: this.range(range).domain(domain); break;
      }
      return this;
    }

    const implicit = Symbol("implicit");

    function ordinal() {
      var index = new InternMap(),
          domain = [],
          range = [],
          unknown = implicit;

      function scale(d) {
        let i = index.get(d);
        if (i === undefined) {
          if (unknown !== implicit) return unknown;
          index.set(d, i = domain.push(d) - 1);
        }
        return range[i % range.length];
      }

      scale.domain = function(_) {
        if (!arguments.length) return domain.slice();
        domain = [], index = new InternMap();
        for (const value of _) {
          if (index.has(value)) continue;
          index.set(value, domain.push(value) - 1);
        }
        return scale;
      };

      scale.range = function(_) {
        return arguments.length ? (range = Array.from(_), scale) : range.slice();
      };

      scale.unknown = function(_) {
        return arguments.length ? (unknown = _, scale) : unknown;
      };

      scale.copy = function() {
        return ordinal(domain, range).unknown(unknown);
      };

      initRange.apply(scale, arguments);

      return scale;
    }

    function band() {
      var scale = ordinal().unknown(undefined),
          domain = scale.domain,
          ordinalRange = scale.range,
          r0 = 0,
          r1 = 1,
          step,
          bandwidth,
          round = false,
          paddingInner = 0,
          paddingOuter = 0,
          align = 0.5;

      delete scale.unknown;

      function rescale() {
        var n = domain().length,
            reverse = r1 < r0,
            start = reverse ? r1 : r0,
            stop = reverse ? r0 : r1;
        step = (stop - start) / Math.max(1, n - paddingInner + paddingOuter * 2);
        if (round) step = Math.floor(step);
        start += (stop - start - step * (n - paddingInner)) * align;
        bandwidth = step * (1 - paddingInner);
        if (round) start = Math.round(start), bandwidth = Math.round(bandwidth);
        var values = range(n).map(function(i) { return start + step * i; });
        return ordinalRange(reverse ? values.reverse() : values);
      }

      scale.domain = function(_) {
        return arguments.length ? (domain(_), rescale()) : domain();
      };

      scale.range = function(_) {
        return arguments.length ? ([r0, r1] = _, r0 = +r0, r1 = +r1, rescale()) : [r0, r1];
      };

      scale.rangeRound = function(_) {
        return [r0, r1] = _, r0 = +r0, r1 = +r1, round = true, rescale();
      };

      scale.bandwidth = function() {
        return bandwidth;
      };

      scale.step = function() {
        return step;
      };

      scale.round = function(_) {
        return arguments.length ? (round = !!_, rescale()) : round;
      };

      scale.padding = function(_) {
        return arguments.length ? (paddingInner = Math.min(1, paddingOuter = +_), rescale()) : paddingInner;
      };

      scale.paddingInner = function(_) {
        return arguments.length ? (paddingInner = Math.min(1, _), rescale()) : paddingInner;
      };

      scale.paddingOuter = function(_) {
        return arguments.length ? (paddingOuter = +_, rescale()) : paddingOuter;
      };

      scale.align = function(_) {
        return arguments.length ? (align = Math.max(0, Math.min(1, _)), rescale()) : align;
      };

      scale.copy = function() {
        return band(domain(), [r0, r1])
            .round(round)
            .paddingInner(paddingInner)
            .paddingOuter(paddingOuter)
            .align(align);
      };

      return initRange.apply(rescale(), arguments);
    }

    function define(constructor, factory, prototype) {
      constructor.prototype = factory.prototype = prototype;
      prototype.constructor = constructor;
    }

    function extend(parent, definition) {
      var prototype = Object.create(parent.prototype);
      for (var key in definition) prototype[key] = definition[key];
      return prototype;
    }

    function Color() {}

    var darker = 0.7;
    var brighter = 1 / darker;

    var reI = "\\s*([+-]?\\d+)\\s*",
        reN = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*",
        reP = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*",
        reHex = /^#([0-9a-f]{3,8})$/,
        reRgbInteger = new RegExp(`^rgb\\(${reI},${reI},${reI}\\)$`),
        reRgbPercent = new RegExp(`^rgb\\(${reP},${reP},${reP}\\)$`),
        reRgbaInteger = new RegExp(`^rgba\\(${reI},${reI},${reI},${reN}\\)$`),
        reRgbaPercent = new RegExp(`^rgba\\(${reP},${reP},${reP},${reN}\\)$`),
        reHslPercent = new RegExp(`^hsl\\(${reN},${reP},${reP}\\)$`),
        reHslaPercent = new RegExp(`^hsla\\(${reN},${reP},${reP},${reN}\\)$`);

    var named = {
      aliceblue: 0xf0f8ff,
      antiquewhite: 0xfaebd7,
      aqua: 0x00ffff,
      aquamarine: 0x7fffd4,
      azure: 0xf0ffff,
      beige: 0xf5f5dc,
      bisque: 0xffe4c4,
      black: 0x000000,
      blanchedalmond: 0xffebcd,
      blue: 0x0000ff,
      blueviolet: 0x8a2be2,
      brown: 0xa52a2a,
      burlywood: 0xdeb887,
      cadetblue: 0x5f9ea0,
      chartreuse: 0x7fff00,
      chocolate: 0xd2691e,
      coral: 0xff7f50,
      cornflowerblue: 0x6495ed,
      cornsilk: 0xfff8dc,
      crimson: 0xdc143c,
      cyan: 0x00ffff,
      darkblue: 0x00008b,
      darkcyan: 0x008b8b,
      darkgoldenrod: 0xb8860b,
      darkgray: 0xa9a9a9,
      darkgreen: 0x006400,
      darkgrey: 0xa9a9a9,
      darkkhaki: 0xbdb76b,
      darkmagenta: 0x8b008b,
      darkolivegreen: 0x556b2f,
      darkorange: 0xff8c00,
      darkorchid: 0x9932cc,
      darkred: 0x8b0000,
      darksalmon: 0xe9967a,
      darkseagreen: 0x8fbc8f,
      darkslateblue: 0x483d8b,
      darkslategray: 0x2f4f4f,
      darkslategrey: 0x2f4f4f,
      darkturquoise: 0x00ced1,
      darkviolet: 0x9400d3,
      deeppink: 0xff1493,
      deepskyblue: 0x00bfff,
      dimgray: 0x696969,
      dimgrey: 0x696969,
      dodgerblue: 0x1e90ff,
      firebrick: 0xb22222,
      floralwhite: 0xfffaf0,
      forestgreen: 0x228b22,
      fuchsia: 0xff00ff,
      gainsboro: 0xdcdcdc,
      ghostwhite: 0xf8f8ff,
      gold: 0xffd700,
      goldenrod: 0xdaa520,
      gray: 0x808080,
      green: 0x008000,
      greenyellow: 0xadff2f,
      grey: 0x808080,
      honeydew: 0xf0fff0,
      hotpink: 0xff69b4,
      indianred: 0xcd5c5c,
      indigo: 0x4b0082,
      ivory: 0xfffff0,
      khaki: 0xf0e68c,
      lavender: 0xe6e6fa,
      lavenderblush: 0xfff0f5,
      lawngreen: 0x7cfc00,
      lemonchiffon: 0xfffacd,
      lightblue: 0xadd8e6,
      lightcoral: 0xf08080,
      lightcyan: 0xe0ffff,
      lightgoldenrodyellow: 0xfafad2,
      lightgray: 0xd3d3d3,
      lightgreen: 0x90ee90,
      lightgrey: 0xd3d3d3,
      lightpink: 0xffb6c1,
      lightsalmon: 0xffa07a,
      lightseagreen: 0x20b2aa,
      lightskyblue: 0x87cefa,
      lightslategray: 0x778899,
      lightslategrey: 0x778899,
      lightsteelblue: 0xb0c4de,
      lightyellow: 0xffffe0,
      lime: 0x00ff00,
      limegreen: 0x32cd32,
      linen: 0xfaf0e6,
      magenta: 0xff00ff,
      maroon: 0x800000,
      mediumaquamarine: 0x66cdaa,
      mediumblue: 0x0000cd,
      mediumorchid: 0xba55d3,
      mediumpurple: 0x9370db,
      mediumseagreen: 0x3cb371,
      mediumslateblue: 0x7b68ee,
      mediumspringgreen: 0x00fa9a,
      mediumturquoise: 0x48d1cc,
      mediumvioletred: 0xc71585,
      midnightblue: 0x191970,
      mintcream: 0xf5fffa,
      mistyrose: 0xffe4e1,
      moccasin: 0xffe4b5,
      navajowhite: 0xffdead,
      navy: 0x000080,
      oldlace: 0xfdf5e6,
      olive: 0x808000,
      olivedrab: 0x6b8e23,
      orange: 0xffa500,
      orangered: 0xff4500,
      orchid: 0xda70d6,
      palegoldenrod: 0xeee8aa,
      palegreen: 0x98fb98,
      paleturquoise: 0xafeeee,
      palevioletred: 0xdb7093,
      papayawhip: 0xffefd5,
      peachpuff: 0xffdab9,
      peru: 0xcd853f,
      pink: 0xffc0cb,
      plum: 0xdda0dd,
      powderblue: 0xb0e0e6,
      purple: 0x800080,
      rebeccapurple: 0x663399,
      red: 0xff0000,
      rosybrown: 0xbc8f8f,
      royalblue: 0x4169e1,
      saddlebrown: 0x8b4513,
      salmon: 0xfa8072,
      sandybrown: 0xf4a460,
      seagreen: 0x2e8b57,
      seashell: 0xfff5ee,
      sienna: 0xa0522d,
      silver: 0xc0c0c0,
      skyblue: 0x87ceeb,
      slateblue: 0x6a5acd,
      slategray: 0x708090,
      slategrey: 0x708090,
      snow: 0xfffafa,
      springgreen: 0x00ff7f,
      steelblue: 0x4682b4,
      tan: 0xd2b48c,
      teal: 0x008080,
      thistle: 0xd8bfd8,
      tomato: 0xff6347,
      turquoise: 0x40e0d0,
      violet: 0xee82ee,
      wheat: 0xf5deb3,
      white: 0xffffff,
      whitesmoke: 0xf5f5f5,
      yellow: 0xffff00,
      yellowgreen: 0x9acd32
    };

    define(Color, color, {
      copy(channels) {
        return Object.assign(new this.constructor, this, channels);
      },
      displayable() {
        return this.rgb().displayable();
      },
      hex: color_formatHex, // Deprecated! Use color.formatHex.
      formatHex: color_formatHex,
      formatHex8: color_formatHex8,
      formatHsl: color_formatHsl,
      formatRgb: color_formatRgb,
      toString: color_formatRgb
    });

    function color_formatHex() {
      return this.rgb().formatHex();
    }

    function color_formatHex8() {
      return this.rgb().formatHex8();
    }

    function color_formatHsl() {
      return hslConvert(this).formatHsl();
    }

    function color_formatRgb() {
      return this.rgb().formatRgb();
    }

    function color(format) {
      var m, l;
      format = (format + "").trim().toLowerCase();
      return (m = reHex.exec(format)) ? (l = m[1].length, m = parseInt(m[1], 16), l === 6 ? rgbn(m) // #ff0000
          : l === 3 ? new Rgb((m >> 8 & 0xf) | (m >> 4 & 0xf0), (m >> 4 & 0xf) | (m & 0xf0), ((m & 0xf) << 4) | (m & 0xf), 1) // #f00
          : l === 8 ? rgba(m >> 24 & 0xff, m >> 16 & 0xff, m >> 8 & 0xff, (m & 0xff) / 0xff) // #ff000000
          : l === 4 ? rgba((m >> 12 & 0xf) | (m >> 8 & 0xf0), (m >> 8 & 0xf) | (m >> 4 & 0xf0), (m >> 4 & 0xf) | (m & 0xf0), (((m & 0xf) << 4) | (m & 0xf)) / 0xff) // #f000
          : null) // invalid hex
          : (m = reRgbInteger.exec(format)) ? new Rgb(m[1], m[2], m[3], 1) // rgb(255, 0, 0)
          : (m = reRgbPercent.exec(format)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) // rgb(100%, 0%, 0%)
          : (m = reRgbaInteger.exec(format)) ? rgba(m[1], m[2], m[3], m[4]) // rgba(255, 0, 0, 1)
          : (m = reRgbaPercent.exec(format)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) // rgb(100%, 0%, 0%, 1)
          : (m = reHslPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) // hsl(120, 50%, 50%)
          : (m = reHslaPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) // hsla(120, 50%, 50%, 1)
          : named.hasOwnProperty(format) ? rgbn(named[format]) // eslint-disable-line no-prototype-builtins
          : format === "transparent" ? new Rgb(NaN, NaN, NaN, 0)
          : null;
    }

    function rgbn(n) {
      return new Rgb(n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff, 1);
    }

    function rgba(r, g, b, a) {
      if (a <= 0) r = g = b = NaN;
      return new Rgb(r, g, b, a);
    }

    function rgbConvert(o) {
      if (!(o instanceof Color)) o = color(o);
      if (!o) return new Rgb;
      o = o.rgb();
      return new Rgb(o.r, o.g, o.b, o.opacity);
    }

    function rgb$1(r, g, b, opacity) {
      return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
    }

    function Rgb(r, g, b, opacity) {
      this.r = +r;
      this.g = +g;
      this.b = +b;
      this.opacity = +opacity;
    }

    define(Rgb, rgb$1, extend(Color, {
      brighter(k) {
        k = k == null ? brighter : Math.pow(brighter, k);
        return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
      },
      darker(k) {
        k = k == null ? darker : Math.pow(darker, k);
        return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
      },
      rgb() {
        return this;
      },
      clamp() {
        return new Rgb(clampi(this.r), clampi(this.g), clampi(this.b), clampa(this.opacity));
      },
      displayable() {
        return (-0.5 <= this.r && this.r < 255.5)
            && (-0.5 <= this.g && this.g < 255.5)
            && (-0.5 <= this.b && this.b < 255.5)
            && (0 <= this.opacity && this.opacity <= 1);
      },
      hex: rgb_formatHex, // Deprecated! Use color.formatHex.
      formatHex: rgb_formatHex,
      formatHex8: rgb_formatHex8,
      formatRgb: rgb_formatRgb,
      toString: rgb_formatRgb
    }));

    function rgb_formatHex() {
      return `#${hex(this.r)}${hex(this.g)}${hex(this.b)}`;
    }

    function rgb_formatHex8() {
      return `#${hex(this.r)}${hex(this.g)}${hex(this.b)}${hex((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
    }

    function rgb_formatRgb() {
      const a = clampa(this.opacity);
      return `${a === 1 ? "rgb(" : "rgba("}${clampi(this.r)}, ${clampi(this.g)}, ${clampi(this.b)}${a === 1 ? ")" : `, ${a})`}`;
    }

    function clampa(opacity) {
      return isNaN(opacity) ? 1 : Math.max(0, Math.min(1, opacity));
    }

    function clampi(value) {
      return Math.max(0, Math.min(255, Math.round(value) || 0));
    }

    function hex(value) {
      value = clampi(value);
      return (value < 16 ? "0" : "") + value.toString(16);
    }

    function hsla(h, s, l, a) {
      if (a <= 0) h = s = l = NaN;
      else if (l <= 0 || l >= 1) h = s = NaN;
      else if (s <= 0) h = NaN;
      return new Hsl(h, s, l, a);
    }

    function hslConvert(o) {
      if (o instanceof Hsl) return new Hsl(o.h, o.s, o.l, o.opacity);
      if (!(o instanceof Color)) o = color(o);
      if (!o) return new Hsl;
      if (o instanceof Hsl) return o;
      o = o.rgb();
      var r = o.r / 255,
          g = o.g / 255,
          b = o.b / 255,
          min = Math.min(r, g, b),
          max = Math.max(r, g, b),
          h = NaN,
          s = max - min,
          l = (max + min) / 2;
      if (s) {
        if (r === max) h = (g - b) / s + (g < b) * 6;
        else if (g === max) h = (b - r) / s + 2;
        else h = (r - g) / s + 4;
        s /= l < 0.5 ? max + min : 2 - max - min;
        h *= 60;
      } else {
        s = l > 0 && l < 1 ? 0 : h;
      }
      return new Hsl(h, s, l, o.opacity);
    }

    function hsl(h, s, l, opacity) {
      return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s, l, opacity == null ? 1 : opacity);
    }

    function Hsl(h, s, l, opacity) {
      this.h = +h;
      this.s = +s;
      this.l = +l;
      this.opacity = +opacity;
    }

    define(Hsl, hsl, extend(Color, {
      brighter(k) {
        k = k == null ? brighter : Math.pow(brighter, k);
        return new Hsl(this.h, this.s, this.l * k, this.opacity);
      },
      darker(k) {
        k = k == null ? darker : Math.pow(darker, k);
        return new Hsl(this.h, this.s, this.l * k, this.opacity);
      },
      rgb() {
        var h = this.h % 360 + (this.h < 0) * 360,
            s = isNaN(h) || isNaN(this.s) ? 0 : this.s,
            l = this.l,
            m2 = l + (l < 0.5 ? l : 1 - l) * s,
            m1 = 2 * l - m2;
        return new Rgb(
          hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2),
          hsl2rgb(h, m1, m2),
          hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2),
          this.opacity
        );
      },
      clamp() {
        return new Hsl(clamph(this.h), clampt(this.s), clampt(this.l), clampa(this.opacity));
      },
      displayable() {
        return (0 <= this.s && this.s <= 1 || isNaN(this.s))
            && (0 <= this.l && this.l <= 1)
            && (0 <= this.opacity && this.opacity <= 1);
      },
      formatHsl() {
        const a = clampa(this.opacity);
        return `${a === 1 ? "hsl(" : "hsla("}${clamph(this.h)}, ${clampt(this.s) * 100}%, ${clampt(this.l) * 100}%${a === 1 ? ")" : `, ${a})`}`;
      }
    }));

    function clamph(value) {
      value = (value || 0) % 360;
      return value < 0 ? value + 360 : value;
    }

    function clampt(value) {
      return Math.max(0, Math.min(1, value || 0));
    }

    /* From FvD 13.37, CSS Color Module Level 3 */
    function hsl2rgb(h, m1, m2) {
      return (h < 60 ? m1 + (m2 - m1) * h / 60
          : h < 180 ? m2
          : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60
          : m1) * 255;
    }

    var constant$2 = x => () => x;

    function linear$1(a, d) {
      return function(t) {
        return a + t * d;
      };
    }

    function exponential(a, b, y) {
      return a = Math.pow(a, y), b = Math.pow(b, y) - a, y = 1 / y, function(t) {
        return Math.pow(a + t * b, y);
      };
    }

    function gamma(y) {
      return (y = +y) === 1 ? nogamma : function(a, b) {
        return b - a ? exponential(a, b, y) : constant$2(isNaN(a) ? b : a);
      };
    }

    function nogamma(a, b) {
      var d = b - a;
      return d ? linear$1(a, d) : constant$2(isNaN(a) ? b : a);
    }

    var rgb = (function rgbGamma(y) {
      var color = gamma(y);

      function rgb(start, end) {
        var r = color((start = rgb$1(start)).r, (end = rgb$1(end)).r),
            g = color(start.g, end.g),
            b = color(start.b, end.b),
            opacity = nogamma(start.opacity, end.opacity);
        return function(t) {
          start.r = r(t);
          start.g = g(t);
          start.b = b(t);
          start.opacity = opacity(t);
          return start + "";
        };
      }

      rgb.gamma = rgbGamma;

      return rgb;
    })(1);

    function numberArray(a, b) {
      if (!b) b = [];
      var n = a ? Math.min(b.length, a.length) : 0,
          c = b.slice(),
          i;
      return function(t) {
        for (i = 0; i < n; ++i) c[i] = a[i] * (1 - t) + b[i] * t;
        return c;
      };
    }

    function isNumberArray(x) {
      return ArrayBuffer.isView(x) && !(x instanceof DataView);
    }

    function genericArray(a, b) {
      var nb = b ? b.length : 0,
          na = a ? Math.min(nb, a.length) : 0,
          x = new Array(na),
          c = new Array(nb),
          i;

      for (i = 0; i < na; ++i) x[i] = interpolate(a[i], b[i]);
      for (; i < nb; ++i) c[i] = b[i];

      return function(t) {
        for (i = 0; i < na; ++i) c[i] = x[i](t);
        return c;
      };
    }

    function date$1(a, b) {
      var d = new Date;
      return a = +a, b = +b, function(t) {
        return d.setTime(a * (1 - t) + b * t), d;
      };
    }

    function interpolateNumber(a, b) {
      return a = +a, b = +b, function(t) {
        return a * (1 - t) + b * t;
      };
    }

    function object(a, b) {
      var i = {},
          c = {},
          k;

      if (a === null || typeof a !== "object") a = {};
      if (b === null || typeof b !== "object") b = {};

      for (k in b) {
        if (k in a) {
          i[k] = interpolate(a[k], b[k]);
        } else {
          c[k] = b[k];
        }
      }

      return function(t) {
        for (k in i) c[k] = i[k](t);
        return c;
      };
    }

    var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,
        reB = new RegExp(reA.source, "g");

    function zero(b) {
      return function() {
        return b;
      };
    }

    function one(b) {
      return function(t) {
        return b(t) + "";
      };
    }

    function string(a, b) {
      var bi = reA.lastIndex = reB.lastIndex = 0, // scan index for next number in b
          am, // current match in a
          bm, // current match in b
          bs, // string preceding current number in b, if any
          i = -1, // index in s
          s = [], // string constants and placeholders
          q = []; // number interpolators

      // Coerce inputs to strings.
      a = a + "", b = b + "";

      // Interpolate pairs of numbers in a & b.
      while ((am = reA.exec(a))
          && (bm = reB.exec(b))) {
        if ((bs = bm.index) > bi) { // a string precedes the next number in b
          bs = b.slice(bi, bs);
          if (s[i]) s[i] += bs; // coalesce with previous string
          else s[++i] = bs;
        }
        if ((am = am[0]) === (bm = bm[0])) { // numbers in a & b match
          if (s[i]) s[i] += bm; // coalesce with previous string
          else s[++i] = bm;
        } else { // interpolate non-matching numbers
          s[++i] = null;
          q.push({i: i, x: interpolateNumber(am, bm)});
        }
        bi = reB.lastIndex;
      }

      // Add remains of b.
      if (bi < b.length) {
        bs = b.slice(bi);
        if (s[i]) s[i] += bs; // coalesce with previous string
        else s[++i] = bs;
      }

      // Special optimization for only a single match.
      // Otherwise, interpolate each of the numbers and rejoin the string.
      return s.length < 2 ? (q[0]
          ? one(q[0].x)
          : zero(b))
          : (b = q.length, function(t) {
              for (var i = 0, o; i < b; ++i) s[(o = q[i]).i] = o.x(t);
              return s.join("");
            });
    }

    function interpolate(a, b) {
      var t = typeof b, c;
      return b == null || t === "boolean" ? constant$2(b)
          : (t === "number" ? interpolateNumber
          : t === "string" ? ((c = color(b)) ? (b = c, rgb) : string)
          : b instanceof color ? rgb
          : b instanceof Date ? date$1
          : isNumberArray(b) ? numberArray
          : Array.isArray(b) ? genericArray
          : typeof b.valueOf !== "function" && typeof b.toString !== "function" || isNaN(b) ? object
          : interpolateNumber)(a, b);
    }

    function interpolateRound(a, b) {
      return a = +a, b = +b, function(t) {
        return Math.round(a * (1 - t) + b * t);
      };
    }

    function constants(x) {
      return function() {
        return x;
      };
    }

    function number$1(x) {
      return +x;
    }

    var unit = [0, 1];

    function identity$2(x) {
      return x;
    }

    function normalize(a, b) {
      return (b -= (a = +a))
          ? function(x) { return (x - a) / b; }
          : constants(isNaN(b) ? NaN : 0.5);
    }

    function clamper(a, b) {
      var t;
      if (a > b) t = a, a = b, b = t;
      return function(x) { return Math.max(a, Math.min(b, x)); };
    }

    // normalize(a, b)(x) takes a domain value x in [a,b] and returns the corresponding parameter t in [0,1].
    // interpolate(a, b)(t) takes a parameter t in [0,1] and returns the corresponding range value x in [a,b].
    function bimap(domain, range, interpolate) {
      var d0 = domain[0], d1 = domain[1], r0 = range[0], r1 = range[1];
      if (d1 < d0) d0 = normalize(d1, d0), r0 = interpolate(r1, r0);
      else d0 = normalize(d0, d1), r0 = interpolate(r0, r1);
      return function(x) { return r0(d0(x)); };
    }

    function polymap(domain, range, interpolate) {
      var j = Math.min(domain.length, range.length) - 1,
          d = new Array(j),
          r = new Array(j),
          i = -1;

      // Reverse descending domains.
      if (domain[j] < domain[0]) {
        domain = domain.slice().reverse();
        range = range.slice().reverse();
      }

      while (++i < j) {
        d[i] = normalize(domain[i], domain[i + 1]);
        r[i] = interpolate(range[i], range[i + 1]);
      }

      return function(x) {
        var i = bisect(domain, x, 1, j) - 1;
        return r[i](d[i](x));
      };
    }

    function copy(source, target) {
      return target
          .domain(source.domain())
          .range(source.range())
          .interpolate(source.interpolate())
          .clamp(source.clamp())
          .unknown(source.unknown());
    }

    function transformer() {
      var domain = unit,
          range = unit,
          interpolate$1 = interpolate,
          transform,
          untransform,
          unknown,
          clamp = identity$2,
          piecewise,
          output,
          input;

      function rescale() {
        var n = Math.min(domain.length, range.length);
        if (clamp !== identity$2) clamp = clamper(domain[0], domain[n - 1]);
        piecewise = n > 2 ? polymap : bimap;
        output = input = null;
        return scale;
      }

      function scale(x) {
        return x == null || isNaN(x = +x) ? unknown : (output || (output = piecewise(domain.map(transform), range, interpolate$1)))(transform(clamp(x)));
      }

      scale.invert = function(y) {
        return clamp(untransform((input || (input = piecewise(range, domain.map(transform), interpolateNumber)))(y)));
      };

      scale.domain = function(_) {
        return arguments.length ? (domain = Array.from(_, number$1), rescale()) : domain.slice();
      };

      scale.range = function(_) {
        return arguments.length ? (range = Array.from(_), rescale()) : range.slice();
      };

      scale.rangeRound = function(_) {
        return range = Array.from(_), interpolate$1 = interpolateRound, rescale();
      };

      scale.clamp = function(_) {
        return arguments.length ? (clamp = _ ? true : identity$2, rescale()) : clamp !== identity$2;
      };

      scale.interpolate = function(_) {
        return arguments.length ? (interpolate$1 = _, rescale()) : interpolate$1;
      };

      scale.unknown = function(_) {
        return arguments.length ? (unknown = _, scale) : unknown;
      };

      return function(t, u) {
        transform = t, untransform = u;
        return rescale();
      };
    }

    function continuous() {
      return transformer()(identity$2, identity$2);
    }

    function formatDecimal(x) {
      return Math.abs(x = Math.round(x)) >= 1e21
          ? x.toLocaleString("en").replace(/,/g, "")
          : x.toString(10);
    }

    // Computes the decimal coefficient and exponent of the specified number x with
    // significant digits p, where x is positive and p is in [1, 21] or undefined.
    // For example, formatDecimalParts(1.23) returns ["123", 0].
    function formatDecimalParts(x, p) {
      if ((i = (x = p ? x.toExponential(p - 1) : x.toExponential()).indexOf("e")) < 0) return null; // NaN, ±Infinity
      var i, coefficient = x.slice(0, i);

      // The string returned by toExponential either has the form \d\.\d+e[-+]\d+
      // (e.g., 1.2e+3) or the form \de[-+]\d+ (e.g., 1e+3).
      return [
        coefficient.length > 1 ? coefficient[0] + coefficient.slice(2) : coefficient,
        +x.slice(i + 1)
      ];
    }

    function exponent(x) {
      return x = formatDecimalParts(Math.abs(x)), x ? x[1] : NaN;
    }

    function formatGroup(grouping, thousands) {
      return function(value, width) {
        var i = value.length,
            t = [],
            j = 0,
            g = grouping[0],
            length = 0;

        while (i > 0 && g > 0) {
          if (length + g + 1 > width) g = Math.max(1, width - length);
          t.push(value.substring(i -= g, i + g));
          if ((length += g + 1) > width) break;
          g = grouping[j = (j + 1) % grouping.length];
        }

        return t.reverse().join(thousands);
      };
    }

    function formatNumerals(numerals) {
      return function(value) {
        return value.replace(/[0-9]/g, function(i) {
          return numerals[+i];
        });
      };
    }

    // [[fill]align][sign][symbol][0][width][,][.precision][~][type]
    var re = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;

    function formatSpecifier(specifier) {
      if (!(match = re.exec(specifier))) throw new Error("invalid format: " + specifier);
      var match;
      return new FormatSpecifier({
        fill: match[1],
        align: match[2],
        sign: match[3],
        symbol: match[4],
        zero: match[5],
        width: match[6],
        comma: match[7],
        precision: match[8] && match[8].slice(1),
        trim: match[9],
        type: match[10]
      });
    }

    formatSpecifier.prototype = FormatSpecifier.prototype; // instanceof

    function FormatSpecifier(specifier) {
      this.fill = specifier.fill === undefined ? " " : specifier.fill + "";
      this.align = specifier.align === undefined ? ">" : specifier.align + "";
      this.sign = specifier.sign === undefined ? "-" : specifier.sign + "";
      this.symbol = specifier.symbol === undefined ? "" : specifier.symbol + "";
      this.zero = !!specifier.zero;
      this.width = specifier.width === undefined ? undefined : +specifier.width;
      this.comma = !!specifier.comma;
      this.precision = specifier.precision === undefined ? undefined : +specifier.precision;
      this.trim = !!specifier.trim;
      this.type = specifier.type === undefined ? "" : specifier.type + "";
    }

    FormatSpecifier.prototype.toString = function() {
      return this.fill
          + this.align
          + this.sign
          + this.symbol
          + (this.zero ? "0" : "")
          + (this.width === undefined ? "" : Math.max(1, this.width | 0))
          + (this.comma ? "," : "")
          + (this.precision === undefined ? "" : "." + Math.max(0, this.precision | 0))
          + (this.trim ? "~" : "")
          + this.type;
    };

    // Trims insignificant zeros, e.g., replaces 1.2000k with 1.2k.
    function formatTrim(s) {
      out: for (var n = s.length, i = 1, i0 = -1, i1; i < n; ++i) {
        switch (s[i]) {
          case ".": i0 = i1 = i; break;
          case "0": if (i0 === 0) i0 = i; i1 = i; break;
          default: if (!+s[i]) break out; if (i0 > 0) i0 = 0; break;
        }
      }
      return i0 > 0 ? s.slice(0, i0) + s.slice(i1 + 1) : s;
    }

    var prefixExponent;

    function formatPrefixAuto(x, p) {
      var d = formatDecimalParts(x, p);
      if (!d) return x + "";
      var coefficient = d[0],
          exponent = d[1],
          i = exponent - (prefixExponent = Math.max(-8, Math.min(8, Math.floor(exponent / 3))) * 3) + 1,
          n = coefficient.length;
      return i === n ? coefficient
          : i > n ? coefficient + new Array(i - n + 1).join("0")
          : i > 0 ? coefficient.slice(0, i) + "." + coefficient.slice(i)
          : "0." + new Array(1 - i).join("0") + formatDecimalParts(x, Math.max(0, p + i - 1))[0]; // less than 1y!
    }

    function formatRounded(x, p) {
      var d = formatDecimalParts(x, p);
      if (!d) return x + "";
      var coefficient = d[0],
          exponent = d[1];
      return exponent < 0 ? "0." + new Array(-exponent).join("0") + coefficient
          : coefficient.length > exponent + 1 ? coefficient.slice(0, exponent + 1) + "." + coefficient.slice(exponent + 1)
          : coefficient + new Array(exponent - coefficient.length + 2).join("0");
    }

    var formatTypes = {
      "%": (x, p) => (x * 100).toFixed(p),
      "b": (x) => Math.round(x).toString(2),
      "c": (x) => x + "",
      "d": formatDecimal,
      "e": (x, p) => x.toExponential(p),
      "f": (x, p) => x.toFixed(p),
      "g": (x, p) => x.toPrecision(p),
      "o": (x) => Math.round(x).toString(8),
      "p": (x, p) => formatRounded(x * 100, p),
      "r": formatRounded,
      "s": formatPrefixAuto,
      "X": (x) => Math.round(x).toString(16).toUpperCase(),
      "x": (x) => Math.round(x).toString(16)
    };

    function identity$1(x) {
      return x;
    }

    var map = Array.prototype.map,
        prefixes = ["y","z","a","f","p","n","µ","m","","k","M","G","T","P","E","Z","Y"];

    function formatLocale$1(locale) {
      var group = locale.grouping === undefined || locale.thousands === undefined ? identity$1 : formatGroup(map.call(locale.grouping, Number), locale.thousands + ""),
          currencyPrefix = locale.currency === undefined ? "" : locale.currency[0] + "",
          currencySuffix = locale.currency === undefined ? "" : locale.currency[1] + "",
          decimal = locale.decimal === undefined ? "." : locale.decimal + "",
          numerals = locale.numerals === undefined ? identity$1 : formatNumerals(map.call(locale.numerals, String)),
          percent = locale.percent === undefined ? "%" : locale.percent + "",
          minus = locale.minus === undefined ? "−" : locale.minus + "",
          nan = locale.nan === undefined ? "NaN" : locale.nan + "";

      function newFormat(specifier) {
        specifier = formatSpecifier(specifier);

        var fill = specifier.fill,
            align = specifier.align,
            sign = specifier.sign,
            symbol = specifier.symbol,
            zero = specifier.zero,
            width = specifier.width,
            comma = specifier.comma,
            precision = specifier.precision,
            trim = specifier.trim,
            type = specifier.type;

        // The "n" type is an alias for ",g".
        if (type === "n") comma = true, type = "g";

        // The "" type, and any invalid type, is an alias for ".12~g".
        else if (!formatTypes[type]) precision === undefined && (precision = 12), trim = true, type = "g";

        // If zero fill is specified, padding goes after sign and before digits.
        if (zero || (fill === "0" && align === "=")) zero = true, fill = "0", align = "=";

        // Compute the prefix and suffix.
        // For SI-prefix, the suffix is lazily computed.
        var prefix = symbol === "$" ? currencyPrefix : symbol === "#" && /[boxX]/.test(type) ? "0" + type.toLowerCase() : "",
            suffix = symbol === "$" ? currencySuffix : /[%p]/.test(type) ? percent : "";

        // What format function should we use?
        // Is this an integer type?
        // Can this type generate exponential notation?
        var formatType = formatTypes[type],
            maybeSuffix = /[defgprs%]/.test(type);

        // Set the default precision if not specified,
        // or clamp the specified precision to the supported range.
        // For significant precision, it must be in [1, 21].
        // For fixed precision, it must be in [0, 20].
        precision = precision === undefined ? 6
            : /[gprs]/.test(type) ? Math.max(1, Math.min(21, precision))
            : Math.max(0, Math.min(20, precision));

        function format(value) {
          var valuePrefix = prefix,
              valueSuffix = suffix,
              i, n, c;

          if (type === "c") {
            valueSuffix = formatType(value) + valueSuffix;
            value = "";
          } else {
            value = +value;

            // Determine the sign. -0 is not less than 0, but 1 / -0 is!
            var valueNegative = value < 0 || 1 / value < 0;

            // Perform the initial formatting.
            value = isNaN(value) ? nan : formatType(Math.abs(value), precision);

            // Trim insignificant zeros.
            if (trim) value = formatTrim(value);

            // If a negative value rounds to zero after formatting, and no explicit positive sign is requested, hide the sign.
            if (valueNegative && +value === 0 && sign !== "+") valueNegative = false;

            // Compute the prefix and suffix.
            valuePrefix = (valueNegative ? (sign === "(" ? sign : minus) : sign === "-" || sign === "(" ? "" : sign) + valuePrefix;
            valueSuffix = (type === "s" ? prefixes[8 + prefixExponent / 3] : "") + valueSuffix + (valueNegative && sign === "(" ? ")" : "");

            // Break the formatted value into the integer “value” part that can be
            // grouped, and fractional or exponential “suffix” part that is not.
            if (maybeSuffix) {
              i = -1, n = value.length;
              while (++i < n) {
                if (c = value.charCodeAt(i), 48 > c || c > 57) {
                  valueSuffix = (c === 46 ? decimal + value.slice(i + 1) : value.slice(i)) + valueSuffix;
                  value = value.slice(0, i);
                  break;
                }
              }
            }
          }

          // If the fill character is not "0", grouping is applied before padding.
          if (comma && !zero) value = group(value, Infinity);

          // Compute the padding.
          var length = valuePrefix.length + value.length + valueSuffix.length,
              padding = length < width ? new Array(width - length + 1).join(fill) : "";

          // If the fill character is "0", grouping is applied after padding.
          if (comma && zero) value = group(padding + value, padding.length ? width - valueSuffix.length : Infinity), padding = "";

          // Reconstruct the final output based on the desired alignment.
          switch (align) {
            case "<": value = valuePrefix + value + valueSuffix + padding; break;
            case "=": value = valuePrefix + padding + value + valueSuffix; break;
            case "^": value = padding.slice(0, length = padding.length >> 1) + valuePrefix + value + valueSuffix + padding.slice(length); break;
            default: value = padding + valuePrefix + value + valueSuffix; break;
          }

          return numerals(value);
        }

        format.toString = function() {
          return specifier + "";
        };

        return format;
      }

      function formatPrefix(specifier, value) {
        var f = newFormat((specifier = formatSpecifier(specifier), specifier.type = "f", specifier)),
            e = Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3,
            k = Math.pow(10, -e),
            prefix = prefixes[8 + e / 3];
        return function(value) {
          return f(k * value) + prefix;
        };
      }

      return {
        format: newFormat,
        formatPrefix: formatPrefix
      };
    }

    var locale$1;
    var format;
    var formatPrefix;

    defaultLocale$1({
      thousands: ",",
      grouping: [3],
      currency: ["$", ""]
    });

    function defaultLocale$1(definition) {
      locale$1 = formatLocale$1(definition);
      format = locale$1.format;
      formatPrefix = locale$1.formatPrefix;
      return locale$1;
    }

    function precisionFixed(step) {
      return Math.max(0, -exponent(Math.abs(step)));
    }

    function precisionPrefix(step, value) {
      return Math.max(0, Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3 - exponent(Math.abs(step)));
    }

    function precisionRound(step, max) {
      step = Math.abs(step), max = Math.abs(max) - step;
      return Math.max(0, exponent(max) - exponent(step)) + 1;
    }

    function tickFormat(start, stop, count, specifier) {
      var step = tickStep(start, stop, count),
          precision;
      specifier = formatSpecifier(specifier == null ? ",f" : specifier);
      switch (specifier.type) {
        case "s": {
          var value = Math.max(Math.abs(start), Math.abs(stop));
          if (specifier.precision == null && !isNaN(precision = precisionPrefix(step, value))) specifier.precision = precision;
          return formatPrefix(specifier, value);
        }
        case "":
        case "e":
        case "g":
        case "p":
        case "r": {
          if (specifier.precision == null && !isNaN(precision = precisionRound(step, Math.max(Math.abs(start), Math.abs(stop))))) specifier.precision = precision - (specifier.type === "e");
          break;
        }
        case "f":
        case "%": {
          if (specifier.precision == null && !isNaN(precision = precisionFixed(step))) specifier.precision = precision - (specifier.type === "%") * 2;
          break;
        }
      }
      return format(specifier);
    }

    function linearish(scale) {
      var domain = scale.domain;

      scale.ticks = function(count) {
        var d = domain();
        return ticks(d[0], d[d.length - 1], count == null ? 10 : count);
      };

      scale.tickFormat = function(count, specifier) {
        var d = domain();
        return tickFormat(d[0], d[d.length - 1], count == null ? 10 : count, specifier);
      };

      scale.nice = function(count) {
        if (count == null) count = 10;

        var d = domain();
        var i0 = 0;
        var i1 = d.length - 1;
        var start = d[i0];
        var stop = d[i1];
        var prestep;
        var step;
        var maxIter = 10;

        if (stop < start) {
          step = start, start = stop, stop = step;
          step = i0, i0 = i1, i1 = step;
        }
        
        while (maxIter-- > 0) {
          step = tickIncrement(start, stop, count);
          if (step === prestep) {
            d[i0] = start;
            d[i1] = stop;
            return domain(d);
          } else if (step > 0) {
            start = Math.floor(start / step) * step;
            stop = Math.ceil(stop / step) * step;
          } else if (step < 0) {
            start = Math.ceil(start * step) / step;
            stop = Math.floor(stop * step) / step;
          } else {
            break;
          }
          prestep = step;
        }

        return scale;
      };

      return scale;
    }

    function linear() {
      var scale = continuous();

      scale.copy = function() {
        return copy(scale, linear());
      };

      initRange.apply(scale, arguments);

      return linearish(scale);
    }

    function nice(domain, interval) {
      domain = domain.slice();

      var i0 = 0,
          i1 = domain.length - 1,
          x0 = domain[i0],
          x1 = domain[i1],
          t;

      if (x1 < x0) {
        t = i0, i0 = i1, i1 = t;
        t = x0, x0 = x1, x1 = t;
      }

      domain[i0] = interval.floor(x0);
      domain[i1] = interval.ceil(x1);
      return domain;
    }

    function transformLog(x) {
      return Math.log(x);
    }

    function transformExp(x) {
      return Math.exp(x);
    }

    function transformLogn(x) {
      return -Math.log(-x);
    }

    function transformExpn(x) {
      return -Math.exp(-x);
    }

    function pow10(x) {
      return isFinite(x) ? +("1e" + x) : x < 0 ? 0 : x;
    }

    function powp(base) {
      return base === 10 ? pow10
          : base === Math.E ? Math.exp
          : x => Math.pow(base, x);
    }

    function logp(base) {
      return base === Math.E ? Math.log
          : base === 10 && Math.log10
          || base === 2 && Math.log2
          || (base = Math.log(base), x => Math.log(x) / base);
    }

    function reflect(f) {
      return (x, k) => -f(-x, k);
    }

    function loggish(transform) {
      const scale = transform(transformLog, transformExp);
      const domain = scale.domain;
      let base = 10;
      let logs;
      let pows;

      function rescale() {
        logs = logp(base), pows = powp(base);
        if (domain()[0] < 0) {
          logs = reflect(logs), pows = reflect(pows);
          transform(transformLogn, transformExpn);
        } else {
          transform(transformLog, transformExp);
        }
        return scale;
      }

      scale.base = function(_) {
        return arguments.length ? (base = +_, rescale()) : base;
      };

      scale.domain = function(_) {
        return arguments.length ? (domain(_), rescale()) : domain();
      };

      scale.ticks = count => {
        const d = domain();
        let u = d[0];
        let v = d[d.length - 1];
        const r = v < u;

        if (r) ([u, v] = [v, u]);

        let i = logs(u);
        let j = logs(v);
        let k;
        let t;
        const n = count == null ? 10 : +count;
        let z = [];

        if (!(base % 1) && j - i < n) {
          i = Math.floor(i), j = Math.ceil(j);
          if (u > 0) for (; i <= j; ++i) {
            for (k = 1; k < base; ++k) {
              t = i < 0 ? k / pows(-i) : k * pows(i);
              if (t < u) continue;
              if (t > v) break;
              z.push(t);
            }
          } else for (; i <= j; ++i) {
            for (k = base - 1; k >= 1; --k) {
              t = i > 0 ? k / pows(-i) : k * pows(i);
              if (t < u) continue;
              if (t > v) break;
              z.push(t);
            }
          }
          if (z.length * 2 < n) z = ticks(u, v, n);
        } else {
          z = ticks(i, j, Math.min(j - i, n)).map(pows);
        }
        return r ? z.reverse() : z;
      };

      scale.tickFormat = (count, specifier) => {
        if (count == null) count = 10;
        if (specifier == null) specifier = base === 10 ? "s" : ",";
        if (typeof specifier !== "function") {
          if (!(base % 1) && (specifier = formatSpecifier(specifier)).precision == null) specifier.trim = true;
          specifier = format(specifier);
        }
        if (count === Infinity) return specifier;
        const k = Math.max(1, base * count / scale.ticks().length); // TODO fast estimate?
        return d => {
          let i = d / pows(Math.round(logs(d)));
          if (i * base < base - 0.5) i *= base;
          return i <= k ? specifier(d) : "";
        };
      };

      scale.nice = () => {
        return domain(nice(domain(), {
          floor: x => pows(Math.floor(logs(x))),
          ceil: x => pows(Math.ceil(logs(x)))
        }));
      };

      return scale;
    }

    function log$1() {
      const scale = loggish(transformer()).domain([1, 10]);
      scale.copy = () => copy(scale, log$1()).base(scale.base());
      initRange.apply(scale, arguments);
      return scale;
    }

    function transformPow(exponent) {
      return function(x) {
        return x < 0 ? -Math.pow(-x, exponent) : Math.pow(x, exponent);
      };
    }

    function transformSqrt(x) {
      return x < 0 ? -Math.sqrt(-x) : Math.sqrt(x);
    }

    function transformSquare(x) {
      return x < 0 ? -x * x : x * x;
    }

    function powish(transform) {
      var scale = transform(identity$2, identity$2),
          exponent = 1;

      function rescale() {
        return exponent === 1 ? transform(identity$2, identity$2)
            : exponent === 0.5 ? transform(transformSqrt, transformSquare)
            : transform(transformPow(exponent), transformPow(1 / exponent));
      }

      scale.exponent = function(_) {
        return arguments.length ? (exponent = +_, rescale()) : exponent;
      };

      return linearish(scale);
    }

    function pow$1() {
      var scale = powish(transformer());

      scale.copy = function() {
        return copy(scale, pow$1()).exponent(scale.exponent());
      };

      initRange.apply(scale, arguments);

      return scale;
    }

    function sqrt() {
      return pow$1.apply(null, arguments).exponent(0.5);
    }

    var t0 = new Date,
        t1 = new Date;

    function newInterval(floori, offseti, count, field) {

      function interval(date) {
        return floori(date = arguments.length === 0 ? new Date : new Date(+date)), date;
      }

      interval.floor = function(date) {
        return floori(date = new Date(+date)), date;
      };

      interval.ceil = function(date) {
        return floori(date = new Date(date - 1)), offseti(date, 1), floori(date), date;
      };

      interval.round = function(date) {
        var d0 = interval(date),
            d1 = interval.ceil(date);
        return date - d0 < d1 - date ? d0 : d1;
      };

      interval.offset = function(date, step) {
        return offseti(date = new Date(+date), step == null ? 1 : Math.floor(step)), date;
      };

      interval.range = function(start, stop, step) {
        var range = [], previous;
        start = interval.ceil(start);
        step = step == null ? 1 : Math.floor(step);
        if (!(start < stop) || !(step > 0)) return range; // also handles Invalid Date
        do range.push(previous = new Date(+start)), offseti(start, step), floori(start);
        while (previous < start && start < stop);
        return range;
      };

      interval.filter = function(test) {
        return newInterval(function(date) {
          if (date >= date) while (floori(date), !test(date)) date.setTime(date - 1);
        }, function(date, step) {
          if (date >= date) {
            if (step < 0) while (++step <= 0) {
              while (offseti(date, -1), !test(date)) {} // eslint-disable-line no-empty
            } else while (--step >= 0) {
              while (offseti(date, +1), !test(date)) {} // eslint-disable-line no-empty
            }
          }
        });
      };

      if (count) {
        interval.count = function(start, end) {
          t0.setTime(+start), t1.setTime(+end);
          floori(t0), floori(t1);
          return Math.floor(count(t0, t1));
        };

        interval.every = function(step) {
          step = Math.floor(step);
          return !isFinite(step) || !(step > 0) ? null
              : !(step > 1) ? interval
              : interval.filter(field
                  ? function(d) { return field(d) % step === 0; }
                  : function(d) { return interval.count(0, d) % step === 0; });
        };
      }

      return interval;
    }

    var millisecond = newInterval(function() {
      // noop
    }, function(date, step) {
      date.setTime(+date + step);
    }, function(start, end) {
      return end - start;
    });

    // An optimized implementation for this simple case.
    millisecond.every = function(k) {
      k = Math.floor(k);
      if (!isFinite(k) || !(k > 0)) return null;
      if (!(k > 1)) return millisecond;
      return newInterval(function(date) {
        date.setTime(Math.floor(date / k) * k);
      }, function(date, step) {
        date.setTime(+date + step * k);
      }, function(start, end) {
        return (end - start) / k;
      });
    };

    var millisecond$1 = millisecond;
    millisecond.range;

    const durationSecond = 1000;
    const durationMinute = durationSecond * 60;
    const durationHour = durationMinute * 60;
    const durationDay = durationHour * 24;
    const durationWeek = durationDay * 7;
    const durationMonth = durationDay * 30;
    const durationYear = durationDay * 365;

    var second = newInterval(function(date) {
      date.setTime(date - date.getMilliseconds());
    }, function(date, step) {
      date.setTime(+date + step * durationSecond);
    }, function(start, end) {
      return (end - start) / durationSecond;
    }, function(date) {
      return date.getUTCSeconds();
    });

    var utcSecond = second;
    second.range;

    var minute = newInterval(function(date) {
      date.setTime(date - date.getMilliseconds() - date.getSeconds() * durationSecond);
    }, function(date, step) {
      date.setTime(+date + step * durationMinute);
    }, function(start, end) {
      return (end - start) / durationMinute;
    }, function(date) {
      return date.getMinutes();
    });

    var timeMinute = minute;
    minute.range;

    var hour = newInterval(function(date) {
      date.setTime(date - date.getMilliseconds() - date.getSeconds() * durationSecond - date.getMinutes() * durationMinute);
    }, function(date, step) {
      date.setTime(+date + step * durationHour);
    }, function(start, end) {
      return (end - start) / durationHour;
    }, function(date) {
      return date.getHours();
    });

    var timeHour = hour;
    hour.range;

    var day = newInterval(
      date => date.setHours(0, 0, 0, 0),
      (date, step) => date.setDate(date.getDate() + step),
      (start, end) => (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute) / durationDay,
      date => date.getDate() - 1
    );

    var timeDay = day;
    day.range;

    function weekday(i) {
      return newInterval(function(date) {
        date.setDate(date.getDate() - (date.getDay() + 7 - i) % 7);
        date.setHours(0, 0, 0, 0);
      }, function(date, step) {
        date.setDate(date.getDate() + step * 7);
      }, function(start, end) {
        return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute) / durationWeek;
      });
    }

    var sunday = weekday(0);
    var monday = weekday(1);
    var tuesday = weekday(2);
    var wednesday = weekday(3);
    var thursday = weekday(4);
    var friday = weekday(5);
    var saturday = weekday(6);

    sunday.range;
    monday.range;
    tuesday.range;
    wednesday.range;
    thursday.range;
    friday.range;
    saturday.range;

    var month = newInterval(function(date) {
      date.setDate(1);
      date.setHours(0, 0, 0, 0);
    }, function(date, step) {
      date.setMonth(date.getMonth() + step);
    }, function(start, end) {
      return end.getMonth() - start.getMonth() + (end.getFullYear() - start.getFullYear()) * 12;
    }, function(date) {
      return date.getMonth();
    });

    var timeMonth = month;
    month.range;

    var year = newInterval(function(date) {
      date.setMonth(0, 1);
      date.setHours(0, 0, 0, 0);
    }, function(date, step) {
      date.setFullYear(date.getFullYear() + step);
    }, function(start, end) {
      return end.getFullYear() - start.getFullYear();
    }, function(date) {
      return date.getFullYear();
    });

    // An optimized implementation for this simple case.
    year.every = function(k) {
      return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : newInterval(function(date) {
        date.setFullYear(Math.floor(date.getFullYear() / k) * k);
        date.setMonth(0, 1);
        date.setHours(0, 0, 0, 0);
      }, function(date, step) {
        date.setFullYear(date.getFullYear() + step * k);
      });
    };

    var timeYear = year;
    year.range;

    var utcMinute = newInterval(function(date) {
      date.setUTCSeconds(0, 0);
    }, function(date, step) {
      date.setTime(+date + step * durationMinute);
    }, function(start, end) {
      return (end - start) / durationMinute;
    }, function(date) {
      return date.getUTCMinutes();
    });

    var utcMinute$1 = utcMinute;
    utcMinute.range;

    var utcHour = newInterval(function(date) {
      date.setUTCMinutes(0, 0, 0);
    }, function(date, step) {
      date.setTime(+date + step * durationHour);
    }, function(start, end) {
      return (end - start) / durationHour;
    }, function(date) {
      return date.getUTCHours();
    });

    var utcHour$1 = utcHour;
    utcHour.range;

    var utcDay = newInterval(function(date) {
      date.setUTCHours(0, 0, 0, 0);
    }, function(date, step) {
      date.setUTCDate(date.getUTCDate() + step);
    }, function(start, end) {
      return (end - start) / durationDay;
    }, function(date) {
      return date.getUTCDate() - 1;
    });

    var utcDay$1 = utcDay;
    utcDay.range;

    function utcWeekday(i) {
      return newInterval(function(date) {
        date.setUTCDate(date.getUTCDate() - (date.getUTCDay() + 7 - i) % 7);
        date.setUTCHours(0, 0, 0, 0);
      }, function(date, step) {
        date.setUTCDate(date.getUTCDate() + step * 7);
      }, function(start, end) {
        return (end - start) / durationWeek;
      });
    }

    var utcSunday = utcWeekday(0);
    var utcMonday = utcWeekday(1);
    var utcTuesday = utcWeekday(2);
    var utcWednesday = utcWeekday(3);
    var utcThursday = utcWeekday(4);
    var utcFriday = utcWeekday(5);
    var utcSaturday = utcWeekday(6);

    utcSunday.range;
    utcMonday.range;
    utcTuesday.range;
    utcWednesday.range;
    utcThursday.range;
    utcFriday.range;
    utcSaturday.range;

    var utcMonth = newInterval(function(date) {
      date.setUTCDate(1);
      date.setUTCHours(0, 0, 0, 0);
    }, function(date, step) {
      date.setUTCMonth(date.getUTCMonth() + step);
    }, function(start, end) {
      return end.getUTCMonth() - start.getUTCMonth() + (end.getUTCFullYear() - start.getUTCFullYear()) * 12;
    }, function(date) {
      return date.getUTCMonth();
    });

    var utcMonth$1 = utcMonth;
    utcMonth.range;

    var utcYear = newInterval(function(date) {
      date.setUTCMonth(0, 1);
      date.setUTCHours(0, 0, 0, 0);
    }, function(date, step) {
      date.setUTCFullYear(date.getUTCFullYear() + step);
    }, function(start, end) {
      return end.getUTCFullYear() - start.getUTCFullYear();
    }, function(date) {
      return date.getUTCFullYear();
    });

    // An optimized implementation for this simple case.
    utcYear.every = function(k) {
      return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : newInterval(function(date) {
        date.setUTCFullYear(Math.floor(date.getUTCFullYear() / k) * k);
        date.setUTCMonth(0, 1);
        date.setUTCHours(0, 0, 0, 0);
      }, function(date, step) {
        date.setUTCFullYear(date.getUTCFullYear() + step * k);
      });
    };

    var utcYear$1 = utcYear;
    utcYear.range;

    function ticker(year, month, week, day, hour, minute) {

      const tickIntervals = [
        [utcSecond,  1,      durationSecond],
        [utcSecond,  5,  5 * durationSecond],
        [utcSecond, 15, 15 * durationSecond],
        [utcSecond, 30, 30 * durationSecond],
        [minute,  1,      durationMinute],
        [minute,  5,  5 * durationMinute],
        [minute, 15, 15 * durationMinute],
        [minute, 30, 30 * durationMinute],
        [  hour,  1,      durationHour  ],
        [  hour,  3,  3 * durationHour  ],
        [  hour,  6,  6 * durationHour  ],
        [  hour, 12, 12 * durationHour  ],
        [   day,  1,      durationDay   ],
        [   day,  2,  2 * durationDay   ],
        [  week,  1,      durationWeek  ],
        [ month,  1,      durationMonth ],
        [ month,  3,  3 * durationMonth ],
        [  year,  1,      durationYear  ]
      ];

      function ticks(start, stop, count) {
        const reverse = stop < start;
        if (reverse) [start, stop] = [stop, start];
        const interval = count && typeof count.range === "function" ? count : tickInterval(start, stop, count);
        const ticks = interval ? interval.range(start, +stop + 1) : []; // inclusive stop
        return reverse ? ticks.reverse() : ticks;
      }

      function tickInterval(start, stop, count) {
        const target = Math.abs(stop - start) / count;
        const i = bisector(([,, step]) => step).right(tickIntervals, target);
        if (i === tickIntervals.length) return year.every(tickStep(start / durationYear, stop / durationYear, count));
        if (i === 0) return millisecond$1.every(Math.max(tickStep(start, stop, count), 1));
        const [t, step] = tickIntervals[target / tickIntervals[i - 1][2] < tickIntervals[i][2] / target ? i - 1 : i];
        return t.every(step);
      }

      return [ticks, tickInterval];
    }

    ticker(utcYear$1, utcMonth$1, utcSunday, utcDay$1, utcHour$1, utcMinute$1);
    const [timeTicks, timeTickInterval] = ticker(timeYear, timeMonth, sunday, timeDay, timeHour, timeMinute);

    function localDate(d) {
      if (0 <= d.y && d.y < 100) {
        var date = new Date(-1, d.m, d.d, d.H, d.M, d.S, d.L);
        date.setFullYear(d.y);
        return date;
      }
      return new Date(d.y, d.m, d.d, d.H, d.M, d.S, d.L);
    }

    function utcDate(d) {
      if (0 <= d.y && d.y < 100) {
        var date = new Date(Date.UTC(-1, d.m, d.d, d.H, d.M, d.S, d.L));
        date.setUTCFullYear(d.y);
        return date;
      }
      return new Date(Date.UTC(d.y, d.m, d.d, d.H, d.M, d.S, d.L));
    }

    function newDate(y, m, d) {
      return {y: y, m: m, d: d, H: 0, M: 0, S: 0, L: 0};
    }

    function formatLocale(locale) {
      var locale_dateTime = locale.dateTime,
          locale_date = locale.date,
          locale_time = locale.time,
          locale_periods = locale.periods,
          locale_weekdays = locale.days,
          locale_shortWeekdays = locale.shortDays,
          locale_months = locale.months,
          locale_shortMonths = locale.shortMonths;

      var periodRe = formatRe(locale_periods),
          periodLookup = formatLookup(locale_periods),
          weekdayRe = formatRe(locale_weekdays),
          weekdayLookup = formatLookup(locale_weekdays),
          shortWeekdayRe = formatRe(locale_shortWeekdays),
          shortWeekdayLookup = formatLookup(locale_shortWeekdays),
          monthRe = formatRe(locale_months),
          monthLookup = formatLookup(locale_months),
          shortMonthRe = formatRe(locale_shortMonths),
          shortMonthLookup = formatLookup(locale_shortMonths);

      var formats = {
        "a": formatShortWeekday,
        "A": formatWeekday,
        "b": formatShortMonth,
        "B": formatMonth,
        "c": null,
        "d": formatDayOfMonth,
        "e": formatDayOfMonth,
        "f": formatMicroseconds,
        "g": formatYearISO,
        "G": formatFullYearISO,
        "H": formatHour24,
        "I": formatHour12,
        "j": formatDayOfYear,
        "L": formatMilliseconds,
        "m": formatMonthNumber,
        "M": formatMinutes,
        "p": formatPeriod,
        "q": formatQuarter,
        "Q": formatUnixTimestamp,
        "s": formatUnixTimestampSeconds,
        "S": formatSeconds,
        "u": formatWeekdayNumberMonday,
        "U": formatWeekNumberSunday,
        "V": formatWeekNumberISO,
        "w": formatWeekdayNumberSunday,
        "W": formatWeekNumberMonday,
        "x": null,
        "X": null,
        "y": formatYear,
        "Y": formatFullYear,
        "Z": formatZone,
        "%": formatLiteralPercent
      };

      var utcFormats = {
        "a": formatUTCShortWeekday,
        "A": formatUTCWeekday,
        "b": formatUTCShortMonth,
        "B": formatUTCMonth,
        "c": null,
        "d": formatUTCDayOfMonth,
        "e": formatUTCDayOfMonth,
        "f": formatUTCMicroseconds,
        "g": formatUTCYearISO,
        "G": formatUTCFullYearISO,
        "H": formatUTCHour24,
        "I": formatUTCHour12,
        "j": formatUTCDayOfYear,
        "L": formatUTCMilliseconds,
        "m": formatUTCMonthNumber,
        "M": formatUTCMinutes,
        "p": formatUTCPeriod,
        "q": formatUTCQuarter,
        "Q": formatUnixTimestamp,
        "s": formatUnixTimestampSeconds,
        "S": formatUTCSeconds,
        "u": formatUTCWeekdayNumberMonday,
        "U": formatUTCWeekNumberSunday,
        "V": formatUTCWeekNumberISO,
        "w": formatUTCWeekdayNumberSunday,
        "W": formatUTCWeekNumberMonday,
        "x": null,
        "X": null,
        "y": formatUTCYear,
        "Y": formatUTCFullYear,
        "Z": formatUTCZone,
        "%": formatLiteralPercent
      };

      var parses = {
        "a": parseShortWeekday,
        "A": parseWeekday,
        "b": parseShortMonth,
        "B": parseMonth,
        "c": parseLocaleDateTime,
        "d": parseDayOfMonth,
        "e": parseDayOfMonth,
        "f": parseMicroseconds,
        "g": parseYear,
        "G": parseFullYear,
        "H": parseHour24,
        "I": parseHour24,
        "j": parseDayOfYear,
        "L": parseMilliseconds,
        "m": parseMonthNumber,
        "M": parseMinutes,
        "p": parsePeriod,
        "q": parseQuarter,
        "Q": parseUnixTimestamp,
        "s": parseUnixTimestampSeconds,
        "S": parseSeconds,
        "u": parseWeekdayNumberMonday,
        "U": parseWeekNumberSunday,
        "V": parseWeekNumberISO,
        "w": parseWeekdayNumberSunday,
        "W": parseWeekNumberMonday,
        "x": parseLocaleDate,
        "X": parseLocaleTime,
        "y": parseYear,
        "Y": parseFullYear,
        "Z": parseZone,
        "%": parseLiteralPercent
      };

      // These recursive directive definitions must be deferred.
      formats.x = newFormat(locale_date, formats);
      formats.X = newFormat(locale_time, formats);
      formats.c = newFormat(locale_dateTime, formats);
      utcFormats.x = newFormat(locale_date, utcFormats);
      utcFormats.X = newFormat(locale_time, utcFormats);
      utcFormats.c = newFormat(locale_dateTime, utcFormats);

      function newFormat(specifier, formats) {
        return function(date) {
          var string = [],
              i = -1,
              j = 0,
              n = specifier.length,
              c,
              pad,
              format;

          if (!(date instanceof Date)) date = new Date(+date);

          while (++i < n) {
            if (specifier.charCodeAt(i) === 37) {
              string.push(specifier.slice(j, i));
              if ((pad = pads[c = specifier.charAt(++i)]) != null) c = specifier.charAt(++i);
              else pad = c === "e" ? " " : "0";
              if (format = formats[c]) c = format(date, pad);
              string.push(c);
              j = i + 1;
            }
          }

          string.push(specifier.slice(j, i));
          return string.join("");
        };
      }

      function newParse(specifier, Z) {
        return function(string) {
          var d = newDate(1900, undefined, 1),
              i = parseSpecifier(d, specifier, string += "", 0),
              week, day;
          if (i != string.length) return null;

          // If a UNIX timestamp is specified, return it.
          if ("Q" in d) return new Date(d.Q);
          if ("s" in d) return new Date(d.s * 1000 + ("L" in d ? d.L : 0));

          // If this is utcParse, never use the local timezone.
          if (Z && !("Z" in d)) d.Z = 0;

          // The am-pm flag is 0 for AM, and 1 for PM.
          if ("p" in d) d.H = d.H % 12 + d.p * 12;

          // If the month was not specified, inherit from the quarter.
          if (d.m === undefined) d.m = "q" in d ? d.q : 0;

          // Convert day-of-week and week-of-year to day-of-year.
          if ("V" in d) {
            if (d.V < 1 || d.V > 53) return null;
            if (!("w" in d)) d.w = 1;
            if ("Z" in d) {
              week = utcDate(newDate(d.y, 0, 1)), day = week.getUTCDay();
              week = day > 4 || day === 0 ? utcMonday.ceil(week) : utcMonday(week);
              week = utcDay$1.offset(week, (d.V - 1) * 7);
              d.y = week.getUTCFullYear();
              d.m = week.getUTCMonth();
              d.d = week.getUTCDate() + (d.w + 6) % 7;
            } else {
              week = localDate(newDate(d.y, 0, 1)), day = week.getDay();
              week = day > 4 || day === 0 ? monday.ceil(week) : monday(week);
              week = timeDay.offset(week, (d.V - 1) * 7);
              d.y = week.getFullYear();
              d.m = week.getMonth();
              d.d = week.getDate() + (d.w + 6) % 7;
            }
          } else if ("W" in d || "U" in d) {
            if (!("w" in d)) d.w = "u" in d ? d.u % 7 : "W" in d ? 1 : 0;
            day = "Z" in d ? utcDate(newDate(d.y, 0, 1)).getUTCDay() : localDate(newDate(d.y, 0, 1)).getDay();
            d.m = 0;
            d.d = "W" in d ? (d.w + 6) % 7 + d.W * 7 - (day + 5) % 7 : d.w + d.U * 7 - (day + 6) % 7;
          }

          // If a time zone is specified, all fields are interpreted as UTC and then
          // offset according to the specified time zone.
          if ("Z" in d) {
            d.H += d.Z / 100 | 0;
            d.M += d.Z % 100;
            return utcDate(d);
          }

          // Otherwise, all fields are in local time.
          return localDate(d);
        };
      }

      function parseSpecifier(d, specifier, string, j) {
        var i = 0,
            n = specifier.length,
            m = string.length,
            c,
            parse;

        while (i < n) {
          if (j >= m) return -1;
          c = specifier.charCodeAt(i++);
          if (c === 37) {
            c = specifier.charAt(i++);
            parse = parses[c in pads ? specifier.charAt(i++) : c];
            if (!parse || ((j = parse(d, string, j)) < 0)) return -1;
          } else if (c != string.charCodeAt(j++)) {
            return -1;
          }
        }

        return j;
      }

      function parsePeriod(d, string, i) {
        var n = periodRe.exec(string.slice(i));
        return n ? (d.p = periodLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
      }

      function parseShortWeekday(d, string, i) {
        var n = shortWeekdayRe.exec(string.slice(i));
        return n ? (d.w = shortWeekdayLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
      }

      function parseWeekday(d, string, i) {
        var n = weekdayRe.exec(string.slice(i));
        return n ? (d.w = weekdayLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
      }

      function parseShortMonth(d, string, i) {
        var n = shortMonthRe.exec(string.slice(i));
        return n ? (d.m = shortMonthLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
      }

      function parseMonth(d, string, i) {
        var n = monthRe.exec(string.slice(i));
        return n ? (d.m = monthLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
      }

      function parseLocaleDateTime(d, string, i) {
        return parseSpecifier(d, locale_dateTime, string, i);
      }

      function parseLocaleDate(d, string, i) {
        return parseSpecifier(d, locale_date, string, i);
      }

      function parseLocaleTime(d, string, i) {
        return parseSpecifier(d, locale_time, string, i);
      }

      function formatShortWeekday(d) {
        return locale_shortWeekdays[d.getDay()];
      }

      function formatWeekday(d) {
        return locale_weekdays[d.getDay()];
      }

      function formatShortMonth(d) {
        return locale_shortMonths[d.getMonth()];
      }

      function formatMonth(d) {
        return locale_months[d.getMonth()];
      }

      function formatPeriod(d) {
        return locale_periods[+(d.getHours() >= 12)];
      }

      function formatQuarter(d) {
        return 1 + ~~(d.getMonth() / 3);
      }

      function formatUTCShortWeekday(d) {
        return locale_shortWeekdays[d.getUTCDay()];
      }

      function formatUTCWeekday(d) {
        return locale_weekdays[d.getUTCDay()];
      }

      function formatUTCShortMonth(d) {
        return locale_shortMonths[d.getUTCMonth()];
      }

      function formatUTCMonth(d) {
        return locale_months[d.getUTCMonth()];
      }

      function formatUTCPeriod(d) {
        return locale_periods[+(d.getUTCHours() >= 12)];
      }

      function formatUTCQuarter(d) {
        return 1 + ~~(d.getUTCMonth() / 3);
      }

      return {
        format: function(specifier) {
          var f = newFormat(specifier += "", formats);
          f.toString = function() { return specifier; };
          return f;
        },
        parse: function(specifier) {
          var p = newParse(specifier += "", false);
          p.toString = function() { return specifier; };
          return p;
        },
        utcFormat: function(specifier) {
          var f = newFormat(specifier += "", utcFormats);
          f.toString = function() { return specifier; };
          return f;
        },
        utcParse: function(specifier) {
          var p = newParse(specifier += "", true);
          p.toString = function() { return specifier; };
          return p;
        }
      };
    }

    var pads = {"-": "", "_": " ", "0": "0"},
        numberRe = /^\s*\d+/, // note: ignores next directive
        percentRe = /^%/,
        requoteRe = /[\\^$*+?|[\]().{}]/g;

    function pad(value, fill, width) {
      var sign = value < 0 ? "-" : "",
          string = (sign ? -value : value) + "",
          length = string.length;
      return sign + (length < width ? new Array(width - length + 1).join(fill) + string : string);
    }

    function requote(s) {
      return s.replace(requoteRe, "\\$&");
    }

    function formatRe(names) {
      return new RegExp("^(?:" + names.map(requote).join("|") + ")", "i");
    }

    function formatLookup(names) {
      return new Map(names.map((name, i) => [name.toLowerCase(), i]));
    }

    function parseWeekdayNumberSunday(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 1));
      return n ? (d.w = +n[0], i + n[0].length) : -1;
    }

    function parseWeekdayNumberMonday(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 1));
      return n ? (d.u = +n[0], i + n[0].length) : -1;
    }

    function parseWeekNumberSunday(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 2));
      return n ? (d.U = +n[0], i + n[0].length) : -1;
    }

    function parseWeekNumberISO(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 2));
      return n ? (d.V = +n[0], i + n[0].length) : -1;
    }

    function parseWeekNumberMonday(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 2));
      return n ? (d.W = +n[0], i + n[0].length) : -1;
    }

    function parseFullYear(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 4));
      return n ? (d.y = +n[0], i + n[0].length) : -1;
    }

    function parseYear(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 2));
      return n ? (d.y = +n[0] + (+n[0] > 68 ? 1900 : 2000), i + n[0].length) : -1;
    }

    function parseZone(d, string, i) {
      var n = /^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(string.slice(i, i + 6));
      return n ? (d.Z = n[1] ? 0 : -(n[2] + (n[3] || "00")), i + n[0].length) : -1;
    }

    function parseQuarter(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 1));
      return n ? (d.q = n[0] * 3 - 3, i + n[0].length) : -1;
    }

    function parseMonthNumber(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 2));
      return n ? (d.m = n[0] - 1, i + n[0].length) : -1;
    }

    function parseDayOfMonth(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 2));
      return n ? (d.d = +n[0], i + n[0].length) : -1;
    }

    function parseDayOfYear(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 3));
      return n ? (d.m = 0, d.d = +n[0], i + n[0].length) : -1;
    }

    function parseHour24(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 2));
      return n ? (d.H = +n[0], i + n[0].length) : -1;
    }

    function parseMinutes(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 2));
      return n ? (d.M = +n[0], i + n[0].length) : -1;
    }

    function parseSeconds(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 2));
      return n ? (d.S = +n[0], i + n[0].length) : -1;
    }

    function parseMilliseconds(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 3));
      return n ? (d.L = +n[0], i + n[0].length) : -1;
    }

    function parseMicroseconds(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 6));
      return n ? (d.L = Math.floor(n[0] / 1000), i + n[0].length) : -1;
    }

    function parseLiteralPercent(d, string, i) {
      var n = percentRe.exec(string.slice(i, i + 1));
      return n ? i + n[0].length : -1;
    }

    function parseUnixTimestamp(d, string, i) {
      var n = numberRe.exec(string.slice(i));
      return n ? (d.Q = +n[0], i + n[0].length) : -1;
    }

    function parseUnixTimestampSeconds(d, string, i) {
      var n = numberRe.exec(string.slice(i));
      return n ? (d.s = +n[0], i + n[0].length) : -1;
    }

    function formatDayOfMonth(d, p) {
      return pad(d.getDate(), p, 2);
    }

    function formatHour24(d, p) {
      return pad(d.getHours(), p, 2);
    }

    function formatHour12(d, p) {
      return pad(d.getHours() % 12 || 12, p, 2);
    }

    function formatDayOfYear(d, p) {
      return pad(1 + timeDay.count(timeYear(d), d), p, 3);
    }

    function formatMilliseconds(d, p) {
      return pad(d.getMilliseconds(), p, 3);
    }

    function formatMicroseconds(d, p) {
      return formatMilliseconds(d, p) + "000";
    }

    function formatMonthNumber(d, p) {
      return pad(d.getMonth() + 1, p, 2);
    }

    function formatMinutes(d, p) {
      return pad(d.getMinutes(), p, 2);
    }

    function formatSeconds(d, p) {
      return pad(d.getSeconds(), p, 2);
    }

    function formatWeekdayNumberMonday(d) {
      var day = d.getDay();
      return day === 0 ? 7 : day;
    }

    function formatWeekNumberSunday(d, p) {
      return pad(sunday.count(timeYear(d) - 1, d), p, 2);
    }

    function dISO(d) {
      var day = d.getDay();
      return (day >= 4 || day === 0) ? thursday(d) : thursday.ceil(d);
    }

    function formatWeekNumberISO(d, p) {
      d = dISO(d);
      return pad(thursday.count(timeYear(d), d) + (timeYear(d).getDay() === 4), p, 2);
    }

    function formatWeekdayNumberSunday(d) {
      return d.getDay();
    }

    function formatWeekNumberMonday(d, p) {
      return pad(monday.count(timeYear(d) - 1, d), p, 2);
    }

    function formatYear(d, p) {
      return pad(d.getFullYear() % 100, p, 2);
    }

    function formatYearISO(d, p) {
      d = dISO(d);
      return pad(d.getFullYear() % 100, p, 2);
    }

    function formatFullYear(d, p) {
      return pad(d.getFullYear() % 10000, p, 4);
    }

    function formatFullYearISO(d, p) {
      var day = d.getDay();
      d = (day >= 4 || day === 0) ? thursday(d) : thursday.ceil(d);
      return pad(d.getFullYear() % 10000, p, 4);
    }

    function formatZone(d) {
      var z = d.getTimezoneOffset();
      return (z > 0 ? "-" : (z *= -1, "+"))
          + pad(z / 60 | 0, "0", 2)
          + pad(z % 60, "0", 2);
    }

    function formatUTCDayOfMonth(d, p) {
      return pad(d.getUTCDate(), p, 2);
    }

    function formatUTCHour24(d, p) {
      return pad(d.getUTCHours(), p, 2);
    }

    function formatUTCHour12(d, p) {
      return pad(d.getUTCHours() % 12 || 12, p, 2);
    }

    function formatUTCDayOfYear(d, p) {
      return pad(1 + utcDay$1.count(utcYear$1(d), d), p, 3);
    }

    function formatUTCMilliseconds(d, p) {
      return pad(d.getUTCMilliseconds(), p, 3);
    }

    function formatUTCMicroseconds(d, p) {
      return formatUTCMilliseconds(d, p) + "000";
    }

    function formatUTCMonthNumber(d, p) {
      return pad(d.getUTCMonth() + 1, p, 2);
    }

    function formatUTCMinutes(d, p) {
      return pad(d.getUTCMinutes(), p, 2);
    }

    function formatUTCSeconds(d, p) {
      return pad(d.getUTCSeconds(), p, 2);
    }

    function formatUTCWeekdayNumberMonday(d) {
      var dow = d.getUTCDay();
      return dow === 0 ? 7 : dow;
    }

    function formatUTCWeekNumberSunday(d, p) {
      return pad(utcSunday.count(utcYear$1(d) - 1, d), p, 2);
    }

    function UTCdISO(d) {
      var day = d.getUTCDay();
      return (day >= 4 || day === 0) ? utcThursday(d) : utcThursday.ceil(d);
    }

    function formatUTCWeekNumberISO(d, p) {
      d = UTCdISO(d);
      return pad(utcThursday.count(utcYear$1(d), d) + (utcYear$1(d).getUTCDay() === 4), p, 2);
    }

    function formatUTCWeekdayNumberSunday(d) {
      return d.getUTCDay();
    }

    function formatUTCWeekNumberMonday(d, p) {
      return pad(utcMonday.count(utcYear$1(d) - 1, d), p, 2);
    }

    function formatUTCYear(d, p) {
      return pad(d.getUTCFullYear() % 100, p, 2);
    }

    function formatUTCYearISO(d, p) {
      d = UTCdISO(d);
      return pad(d.getUTCFullYear() % 100, p, 2);
    }

    function formatUTCFullYear(d, p) {
      return pad(d.getUTCFullYear() % 10000, p, 4);
    }

    function formatUTCFullYearISO(d, p) {
      var day = d.getUTCDay();
      d = (day >= 4 || day === 0) ? utcThursday(d) : utcThursday.ceil(d);
      return pad(d.getUTCFullYear() % 10000, p, 4);
    }

    function formatUTCZone() {
      return "+0000";
    }

    function formatLiteralPercent() {
      return "%";
    }

    function formatUnixTimestamp(d) {
      return +d;
    }

    function formatUnixTimestampSeconds(d) {
      return Math.floor(+d / 1000);
    }

    var locale;
    var timeFormat;

    defaultLocale({
      dateTime: "%x, %X",
      date: "%-m/%-d/%Y",
      time: "%-I:%M:%S %p",
      periods: ["AM", "PM"],
      days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    });

    function defaultLocale(definition) {
      locale = formatLocale(definition);
      timeFormat = locale.format;
      return locale;
    }

    function date(t) {
      return new Date(t);
    }

    function number(t) {
      return t instanceof Date ? +t : +new Date(+t);
    }

    function calendar(ticks, tickInterval, year, month, week, day, hour, minute, second, format) {
      var scale = continuous(),
          invert = scale.invert,
          domain = scale.domain;

      var formatMillisecond = format(".%L"),
          formatSecond = format(":%S"),
          formatMinute = format("%I:%M"),
          formatHour = format("%I %p"),
          formatDay = format("%a %d"),
          formatWeek = format("%b %d"),
          formatMonth = format("%B"),
          formatYear = format("%Y");

      function tickFormat(date) {
        return (second(date) < date ? formatMillisecond
            : minute(date) < date ? formatSecond
            : hour(date) < date ? formatMinute
            : day(date) < date ? formatHour
            : month(date) < date ? (week(date) < date ? formatDay : formatWeek)
            : year(date) < date ? formatMonth
            : formatYear)(date);
      }

      scale.invert = function(y) {
        return new Date(invert(y));
      };

      scale.domain = function(_) {
        return arguments.length ? domain(Array.from(_, number)) : domain().map(date);
      };

      scale.ticks = function(interval) {
        var d = domain();
        return ticks(d[0], d[d.length - 1], interval == null ? 10 : interval);
      };

      scale.tickFormat = function(count, specifier) {
        return specifier == null ? tickFormat : format(specifier);
      };

      scale.nice = function(interval) {
        var d = domain();
        if (!interval || typeof interval.range !== "function") interval = tickInterval(d[0], d[d.length - 1], interval == null ? 10 : interval);
        return interval ? domain(nice(d, interval)) : scale;
      };

      scale.copy = function() {
        return copy(scale, calendar(ticks, tickInterval, year, month, week, day, hour, minute, second, format));
      };

      return scale;
    }

    function time() {
      return initRange.apply(calendar(timeTicks, timeTickInterval, timeYear, timeMonth, sunday, timeDay, timeHour, timeMinute, utcSecond, timeFormat).domain([new Date(2000, 0, 1), new Date(2000, 0, 2)]), arguments);
    }

    /* src/components/scroller/scrolly.svelte generated by Svelte v3.49.0 */
    const file$y = "src/components/scroller/scrolly.svelte";

    function create_fragment$z(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[7].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[6], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "step-container svelte-xtt0hq");
    			add_location(div, file$y, 80, 0, 1853);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			/*div_binding*/ ctx[8](div);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 64)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[6],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[6])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[6], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			/*div_binding*/ ctx[8](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$z.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$z($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Scrolly', slots, ['default']);
    	let { root = null } = $$props;
    	let { top = 0 } = $$props;
    	let { bottom = 0 } = $$props;
    	let { increments = 100 } = $$props;
    	let { value = undefined } = $$props;
    	const steps = [];
    	const threshold = [];
    	let nodes = [];
    	let intersectionObservers = [];
    	let container;

    	const update = () => {
    		if (!nodes.length) return;
    		nodes.forEach(createObserver);
    	};

    	const mostInView = () => {
    		let maxRatio = 0;
    		let maxIndex = 0;

    		for (let i = 0; i < steps.length; i++) {
    			if (steps[i] > maxRatio) {
    				maxRatio = steps[i];
    				maxIndex = i;
    			}
    		}

    		if (maxRatio > 0) $$invalidate(1, value = maxIndex); else $$invalidate(1, value = undefined);
    	};

    	const createObserver = (node, index) => {
    		const handleIntersect = e => {
    			e[0].isIntersecting;
    			const ratio = e[0].intersectionRatio;
    			steps[index] = ratio;
    			mostInView();
    		};

    		const marginTop = top ? top * -1 : 0;
    		const marginBottom = bottom ? bottom * -1 : 0;
    		const rootMargin = `${marginTop}px 0px ${marginBottom}px 0px`;
    		const options = { root, rootMargin, threshold };
    		if (intersectionObservers[index]) intersectionObservers[index].disconnect();
    		const io = new IntersectionObserver(handleIntersect, options);
    		io.observe(node);
    		intersectionObservers[index] = io;
    	};

    	onMount(() => {
    		for (let i = 0; i < increments + 1; i++) {
    			threshold.push(i / increments);
    		}

    		nodes = container.querySelectorAll(":scope > *");
    		update();
    	});

    	const writable_props = ['root', 'top', 'bottom', 'increments', 'value'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Scrolly> was created with unknown prop '${key}'`);
    	});

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			container = $$value;
    			$$invalidate(0, container);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('root' in $$props) $$invalidate(2, root = $$props.root);
    		if ('top' in $$props) $$invalidate(3, top = $$props.top);
    		if ('bottom' in $$props) $$invalidate(4, bottom = $$props.bottom);
    		if ('increments' in $$props) $$invalidate(5, increments = $$props.increments);
    		if ('value' in $$props) $$invalidate(1, value = $$props.value);
    		if ('$$scope' in $$props) $$invalidate(6, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		root,
    		top,
    		bottom,
    		increments,
    		value,
    		steps,
    		threshold,
    		nodes,
    		intersectionObservers,
    		container,
    		update,
    		mostInView,
    		createObserver
    	});

    	$$self.$inject_state = $$props => {
    		if ('root' in $$props) $$invalidate(2, root = $$props.root);
    		if ('top' in $$props) $$invalidate(3, top = $$props.top);
    		if ('bottom' in $$props) $$invalidate(4, bottom = $$props.bottom);
    		if ('increments' in $$props) $$invalidate(5, increments = $$props.increments);
    		if ('value' in $$props) $$invalidate(1, value = $$props.value);
    		if ('nodes' in $$props) nodes = $$props.nodes;
    		if ('intersectionObservers' in $$props) intersectionObservers = $$props.intersectionObservers;
    		if ('container' in $$props) $$invalidate(0, container = $$props.container);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*top, bottom*/ 24) {
    			(update());
    		}
    	};

    	return [container, value, root, top, bottom, increments, $$scope, slots, div_binding];
    }

    class Scrolly extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$z, create_fragment$z, safe_not_equal, {
    			root: 2,
    			top: 3,
    			bottom: 4,
    			increments: 5,
    			value: 1
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Scrolly",
    			options,
    			id: create_fragment$z.name
    		});
    	}

    	get root() {
    		throw new Error("<Scrolly>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set root(value) {
    		throw new Error("<Scrolly>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get top() {
    		throw new Error("<Scrolly>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set top(value) {
    		throw new Error("<Scrolly>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get bottom() {
    		throw new Error("<Scrolly>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set bottom(value) {
    		throw new Error("<Scrolly>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get increments() {
    		throw new Error("<Scrolly>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set increments(value) {
    		throw new Error("<Scrolly>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<Scrolly>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Scrolly>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop$1) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop$1) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop$1;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop$1;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop$1;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    /**
    	A function to help truth test values. Returns a `true` if zero.
    	@type {number} val The value to test.
    	@returns {boolean}
    */
    function canBeZero (val) {
    	if (val === 0) {
    		return true;
    	}
    	return val;
    }

    /**
    	Make an accessor from a string, number, function or an array of the combination of any
    	@param {String|Number|Function|Array} acc The accessor function, key or list of them.
    	@returns {Function} An accessor function.
    */
    function makeAccessor (acc) {
    	if (!canBeZero(acc)) return null;
    	if (Array.isArray(acc)) {
    		return d => acc.map(k => {
    			return typeof k !== 'function' ? d[k] : k(d);
    		});
    	} else if (typeof acc !== 'function') { // eslint-disable-line no-else-return
    		return d => d[acc];
    	}
    	return acc;
    }

    /**
    	Remove undefined fields from an object
    	@type {object} obj The object to filter
    	@type {object} [comparisonObj={}] TK
    	@returns {object}
    */

    // From Object.fromEntries polyfill https://github.com/tc39/proposal-object-from-entries/blob/master/polyfill.js#L1
    function fromEntries(iter) {
    	const obj = {};

    	for (const pair of iter) {
    		if (Object(pair) !== pair) {
    			throw new TypeError("iterable for fromEntries should yield objects");
    		}

    		// Consistency with Map: contract is that entry has "0" and "1" keys, not
    		// that it is an array or iterable.

    		const { "0": key, "1": val } = pair;

    		Object.defineProperty(obj, key, {
    			configurable: true,
    			enumerable: true,
    			writable: true,
    			value: val,
    		});
    	}

    	return obj;
    }

    function filterObject (obj, comparisonObj = {}) {
    	return fromEntries(Object.entries(obj).filter(([key, value]) => {
    		return value !== undefined
    			&& comparisonObj[key] === undefined;
    	}));
    }

    /**
    	Calculate the extents of desired fields
    	For example, data like this:
    	[{ x: 0, y: -10 }, { x: 10, y: 0 }, { x: 5, y: 10 }]
    	and a fields object like this:
    	`{'x': d => d.x, 'y': d => d.y}`
    	returns an object like this:
    	`{ x: [0, 10], y: [-10, 10] }`
    	@param {Array} data A flat array of objects.
    	@param {{x?: Function, y?: Function, z?: Function, r?: Function}} fields An object containing `x`, `y`, `r` or `z` keys that equal an accessor function.
    	@returns {{x?: [min: Number, max: Number]|[min: String, max: String], y?: [min: Number, max: Number]|[min: String, max: String], z?: [min: Number, max: Number]|[min: String, max: String], r?: [min: Number, max: Number]|[min: String, max: String]}} An object with the same structure as `fields` but instead of an accessor, each key contains an array of a min and a max.
    */
    function calcExtents (data, fields) {
    	if (!Array.isArray(data)) {
    		throw new TypeError('The first argument of calcExtents() must be an array. If you got this error using the <LayerCake> component, consider passing a flat array to the `flatData` prop. More info: https://layercake.graphics/guide/#flatdata');
    	}

    	if (
    		Array.isArray(fields)
    		|| fields === undefined
    		|| fields === null
    	) {
    		throw new TypeError('The second argument of calcExtents() must be an '
    		+ 'object with field names as keys as accessor functions as values.');
    	}

    	const extents = {};

    	const keys = Object.keys(fields);
    	const kl = keys.length;
    	let i;
    	let j;
    	let k;
    	let s;
    	let min;
    	let max;
    	let acc;
    	let val;

    	const dl = data.length;
    	for (i = 0; i < kl; i += 1) {
    		s = keys[i];
    		acc = fields[s];
    		min = null;
    		max = null;
    		for (j = 0; j < dl; j += 1) {
    			val = acc(data[j]);
    			if (Array.isArray(val)) {
    				const vl = val.length;
    				for (k = 0; k < vl; k += 1) {
    					if (val[k] !== undefined && val[k] !== null && Number.isNaN(val[k]) === false) {
    						if (min === null || val[k] < min) {
    							min = val[k];
    						}
    						if (max === null || val[k] > max) {
    							max = val[k];
    						}
    					}
    				}
    			} else if (val !== undefined && val !== null && Number.isNaN(val) === false) {
    				if (min === null || val < min) {
    					min = val;
    				}
    				if (max === null || val > max) {
    					max = val;
    				}
    			}
    		}
    		extents[s] = [min, max];
    	}

    	return extents;
    }

    /* --------------------------------------------
     * If we have a domain from settings, fill in
     * any null values with ones from our measured extents
     * otherwise, return the measured extent
     */
    function partialDomain (domain = [], directive) {
    	if (Array.isArray(directive) === true) {
    		return directive.map((d, i) => {
    			if (d === null) {
    				return domain[i];
    			}
    			return d;
    		});
    	}
    	return domain;
    }

    function calcDomain (s) {
    	return function domainCalc ([$extents, $domain]) {
    		return $extents ? partialDomain($extents[s], $domain) : $domain;
    	};
    }

    var defaultScales = {
    	x: linear,
    	y: linear,
    	z: linear,
    	r: sqrt
    };

    /* --------------------------------------------
     *
     * Determine whether a scale is a log, symlog, power or other
     * This is not meant to be exhaustive of all the different types of
     * scales in d3-scale and focuses on continuous scales
     *
     * --------------------------------------------
     */
    function findScaleType(scale) {
    	if (scale.constant) {
    		return 'symlog';
    	}
    	if (scale.base) {
    		return 'log';
    	}
    	if (scale.exponent) {
    		if (scale.exponent() === 0.5) {
    			return 'sqrt';
    		}
    		return 'pow';
    	}
    	return 'other';
    }

    /**
    	An identity function
    	@type {*} d The value to return.
    	@returns {*}
    */
    function identity (d) {
    	return d;
    }

    function log(sign) {
    	return x => Math.log(sign * x);
    }

    function exp(sign) {
    	return x => sign * Math.exp(x);
    }

    function symlog(c) {
    	return x => Math.sign(x) * Math.log1p(Math.abs(x / c));
    }

    function symexp(c) {
    	return x => Math.sign(x) * Math.expm1(Math.abs(x)) * c;
    }

    function pow(exponent) {
    	return function powFn(x) {
    		return x < 0 ? -Math.pow(-x, exponent) : Math.pow(x, exponent);
    	};
    }

    function getPadFunctions(scale) {
    	const scaleType = findScaleType(scale);

    	if (scaleType === 'log') {
    		const sign = Math.sign(scale.domain()[0]);
    		return { lift: log(sign), ground: exp(sign), scaleType };
    	}
    	if (scaleType === 'pow') {
    		const exponent = 1;
    		return { lift: pow(exponent), ground: pow(1 / exponent), scaleType };
    	}
    	if (scaleType === 'sqrt') {
    		const exponent = 0.5;
    		return { lift: pow(exponent), ground: pow(1 / exponent), scaleType };
    	}
    	if (scaleType === 'symlog') {
    		const constant = 1;
    		return { lift: symlog(constant), ground: symexp(constant), scaleType };
    	}

    	return { lift: identity, ground: identity, scaleType };
    }

    /* --------------------------------------------
     *
     * Returns a modified scale domain by in/decreasing
     * the min/max by taking the desired difference
     * in pixels and converting it to units of data.
     * Returns an array that you can set as the new domain.
     * Padding contributed by @veltman.
     * See here for discussion of transforms: https://github.com/d3/d3-scale/issues/150
     *
     * --------------------------------------------
     */

    function padScale (scale, padding) {
    	if (typeof scale.range !== 'function') {
    		throw new Error('Scale method `range` must be a function');
    	}
    	if (typeof scale.domain !== 'function') {
    		throw new Error('Scale method `domain` must be a function');
    	}
    	if (!Array.isArray(padding)) {
    		return scale.domain();
    	}

    	if (scale.domain().length !== 2) {
    		console.warn('[LayerCake] The scale is expected to have a domain of length 2 to use padding. Are you sure you want to use padding? Your scale\'s domain is:', scale.domain());
    	}
    	if (scale.range().length !== 2) {
    		console.warn('[LayerCake] The scale is expected to have a range of length 2 to use padding. Are you sure you want to use padding? Your scale\'s range is:', scale.range());
    	}

    	const { lift, ground } = getPadFunctions(scale);

    	const d0 = scale.domain()[0];

    	const isTime = Object.prototype.toString.call(d0) === '[object Date]';

    	const [d1, d2] = scale.domain().map(d => {
    		return isTime ? lift(d.getTime()) : lift(d);
    	});
    	const [r1, r2] = scale.range();
    	const paddingLeft = padding[0] || 0;
    	const paddingRight = padding[1] || 0;

    	const step = (d2 - d1) / (Math.abs(r2 - r1) - paddingLeft - paddingRight); // Math.abs() to properly handle reversed scales

    	return [d1 - paddingLeft * step, paddingRight * step + d2].map(d => {
    		return isTime ? ground(new Date(d)) : ground(d);
    	});
    }

    /* eslint-disable no-nested-ternary */
    function calcBaseRange(s, width, height, reverse, percentRange) {
    	let min;
    	let max;
    	if (percentRange === true) {
    		min = 0;
    		max = 100;
    	} else {
    		min = s === 'r' ? 1 : 0;
    		max = s === 'y' ? height : s === 'r' ? 25 : width;
    	}
    	return reverse === true ? [max, min] : [min, max];
    }

    function getDefaultRange(s, width, height, reverse, range, percentRange) {
    	return !range
    		? calcBaseRange(s, width, height, reverse, percentRange)
    		: typeof range === 'function'
    			? range({ width, height })
    			: range;
    }

    function createScale (s) {
    	return function scaleCreator ([$scale, $extents, $domain, $padding, $nice, $reverse, $width, $height, $range, $percentScale]) {
    		if ($extents === null) {
    			return null;
    		}

    		const defaultRange = getDefaultRange(s, $width, $height, $reverse, $range, $percentScale);

    		const scale = $scale === defaultScales[s] ? $scale() : $scale.copy();

    		/* --------------------------------------------
    		 * On creation, `$domain` will already have any nulls filled in
    		 * But if we set it via the context it might not, so rerun it through partialDomain
    		 */
    		scale
    			.domain(partialDomain($extents[s], $domain))
    			.range(defaultRange);

    		if ($padding) {
    			scale.domain(padScale(scale, $padding));
    		}

    		if ($nice === true) {
    			if (typeof scale.nice === 'function') {
    				scale.nice();
    			} else {
    				console.error(`[Layer Cake] You set \`${s}Nice: true\` but the ${s}Scale does not have a \`.nice\` method. Ignoring...`);
    			}
    		}

    		return scale;
    	};
    }

    function createGetter ([$acc, $scale]) {
    	return d => {
    		const val = $acc(d);
    		if (Array.isArray(val)) {
    			return val.map(v => $scale(v));
    		}
    		return $scale(val);
    	};
    }

    function getRange([$scale]) {
    	if (typeof $scale === 'function') {
    		if (typeof $scale.range === 'function') {
    			return $scale.range();
    		}
    		console.error('[LayerCake] Your scale doesn\'t have a `.range` method?');
    	}
    	return null;
    }

    var defaultReverses = {
    	x: false,
    	y: true,
    	z: false,
    	r: false
    };

    /* node_modules/layercake/LayerCake.svelte generated by Svelte v3.49.0 */

    const { Object: Object_1$4, console: console_1 } = globals;
    const file$x = "node_modules/layercake/LayerCake.svelte";

    const get_default_slot_changes$4 = dirty => ({
    	element: dirty[0] & /*element*/ 4,
    	width: dirty[0] & /*$width_d*/ 256,
    	height: dirty[0] & /*$height_d*/ 512,
    	aspectRatio: dirty[0] & /*$aspectRatio_d*/ 1024,
    	containerWidth: dirty[0] & /*$_containerWidth*/ 128,
    	containerHeight: dirty[0] & /*$_containerHeight*/ 64
    });

    const get_default_slot_context$4 = ctx => ({
    	element: /*element*/ ctx[2],
    	width: /*$width_d*/ ctx[8],
    	height: /*$height_d*/ ctx[9],
    	aspectRatio: /*$aspectRatio_d*/ ctx[10],
    	containerWidth: /*$_containerWidth*/ ctx[7],
    	containerHeight: /*$_containerHeight*/ ctx[6]
    });

    // (370:0) {#if (ssr === true || typeof window !== 'undefined')}
    function create_if_block$k(ctx) {
    	let div;
    	let div_resize_listener;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[90].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[89], get_default_slot_context$4);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "layercake-container svelte-vhzpsp");
    			add_render_callback(() => /*div_elementresize_handler*/ ctx[92].call(div));
    			set_style(div, "position", /*position*/ ctx[5], false);
    			set_style(div, "top", /*position*/ ctx[5] === 'absolute' ? '0' : null, false);
    			set_style(div, "right", /*position*/ ctx[5] === 'absolute' ? '0' : null, false);
    			set_style(div, "bottom", /*position*/ ctx[5] === 'absolute' ? '0' : null, false);
    			set_style(div, "left", /*position*/ ctx[5] === 'absolute' ? '0' : null, false);
    			set_style(div, "pointer-events", /*pointerEvents*/ ctx[4] === false ? 'none' : null, false);
    			add_location(div, file$x, 370, 1, 19795);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			/*div_binding*/ ctx[91](div);
    			div_resize_listener = add_resize_listener(div, /*div_elementresize_handler*/ ctx[92].bind(div));
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[0] & /*element, $width_d, $height_d, $aspectRatio_d, $_containerWidth, $_containerHeight*/ 1988 | dirty[2] & /*$$scope*/ 134217728)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[89],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[89])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[89], dirty, get_default_slot_changes$4),
    						get_default_slot_context$4
    					);
    				}
    			}

    			if (dirty[0] & /*position*/ 32) {
    				set_style(div, "position", /*position*/ ctx[5], false);
    			}

    			if (dirty[0] & /*position*/ 32) {
    				set_style(div, "top", /*position*/ ctx[5] === 'absolute' ? '0' : null, false);
    			}

    			if (dirty[0] & /*position*/ 32) {
    				set_style(div, "right", /*position*/ ctx[5] === 'absolute' ? '0' : null, false);
    			}

    			if (dirty[0] & /*position*/ 32) {
    				set_style(div, "bottom", /*position*/ ctx[5] === 'absolute' ? '0' : null, false);
    			}

    			if (dirty[0] & /*position*/ 32) {
    				set_style(div, "left", /*position*/ ctx[5] === 'absolute' ? '0' : null, false);
    			}

    			if (dirty[0] & /*pointerEvents*/ 16) {
    				set_style(div, "pointer-events", /*pointerEvents*/ ctx[4] === false ? 'none' : null, false);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			/*div_binding*/ ctx[91](null);
    			div_resize_listener();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$k.name,
    		type: "if",
    		source: "(370:0) {#if (ssr === true || typeof window !== 'undefined')}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$y(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = (/*ssr*/ ctx[3] === true || typeof window !== 'undefined') && create_if_block$k(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*ssr*/ ctx[3] === true || typeof window !== 'undefined') {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*ssr*/ 8) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$k(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$y.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$y($$self, $$props, $$invalidate) {
    	let context;
    	let $_config;
    	let $_custom;
    	let $_rScale;
    	let $_zScale;
    	let $_yScale;
    	let $_xScale;
    	let $_rRange;
    	let $_zRange;
    	let $_yRange;
    	let $_xRange;
    	let $_rPadding;
    	let $_zPadding;
    	let $_yPadding;
    	let $_xPadding;
    	let $_rReverse;
    	let $_zReverse;
    	let $_yReverse;
    	let $_xReverse;
    	let $_rNice;
    	let $_zNice;
    	let $_yNice;
    	let $_xNice;
    	let $_rDomain;
    	let $_zDomain;
    	let $_yDomain;
    	let $_xDomain;
    	let $_r;
    	let $_z;
    	let $_y;
    	let $_x;
    	let $_padding;
    	let $_flatData;
    	let $_data;
    	let $_extents;
    	let $_containerHeight;
    	let $_containerWidth;
    	let $_percentRange;
    	let $width_d;
    	let $height_d;
    	let $aspectRatio_d;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('LayerCake', slots, ['default']);
    	let { ssr = false } = $$props;
    	let { pointerEvents = true } = $$props;
    	let { position = 'relative' } = $$props;
    	let { percentRange = false } = $$props;
    	let { width = undefined } = $$props;
    	let { height = undefined } = $$props;
    	let { containerWidth = width || 100 } = $$props;
    	let { containerHeight = height || 100 } = $$props;
    	let { element = undefined } = $$props;
    	let { x = undefined } = $$props;
    	let { y = undefined } = $$props;
    	let { z = undefined } = $$props;
    	let { r = undefined } = $$props;
    	let { data = [] } = $$props;
    	let { xDomain = undefined } = $$props;
    	let { yDomain = undefined } = $$props;
    	let { zDomain = undefined } = $$props;
    	let { rDomain = undefined } = $$props;
    	let { xNice = false } = $$props;
    	let { yNice = false } = $$props;
    	let { zNice = false } = $$props;
    	let { rNice = false } = $$props;
    	let { xReverse = defaultReverses.x } = $$props;
    	let { yReverse = defaultReverses.y } = $$props;
    	let { zReverse = defaultReverses.z } = $$props;
    	let { rReverse = defaultReverses.r } = $$props;
    	let { xPadding = undefined } = $$props;
    	let { yPadding = undefined } = $$props;
    	let { zPadding = undefined } = $$props;
    	let { rPadding = undefined } = $$props;
    	let { xScale = defaultScales.x } = $$props;
    	let { yScale = defaultScales.y } = $$props;
    	let { zScale = defaultScales.z } = $$props;
    	let { rScale = defaultScales.r } = $$props;
    	let { xRange = undefined } = $$props;
    	let { yRange = undefined } = $$props;
    	let { zRange = undefined } = $$props;
    	let { rRange = undefined } = $$props;
    	let { padding = {} } = $$props;
    	let { extents = {} } = $$props;
    	let { flatData = undefined } = $$props;
    	let { custom = {} } = $$props;

    	/* --------------------------------------------
     * Keep track of whethr the component has mounted
     * This is used to emit warnings once we have measured
     * the container object and it doesn't have proper dimensions
     */
    	let isMounted = false;

    	onMount(() => {
    		isMounted = true;
    	});

    	/* --------------------------------------------
     * Preserve a copy of our passed in settings before we modify them
     * Return this to the user's context so they can reference things if need be
     * Add the active keys since those aren't on our settings object.
     * This is mostly an escape-hatch
     */
    	const config = {};

    	/* --------------------------------------------
     * Make store versions of each parameter
     * Prefix these with `_` to keep things organized
     */
    	const _percentRange = writable(percentRange);

    	validate_store(_percentRange, '_percentRange');
    	component_subscribe($$self, _percentRange, value => $$invalidate(128, $_percentRange = value));
    	const _containerWidth = writable(containerWidth);
    	validate_store(_containerWidth, '_containerWidth');
    	component_subscribe($$self, _containerWidth, value => $$invalidate(7, $_containerWidth = value));
    	const _containerHeight = writable(containerHeight);
    	validate_store(_containerHeight, '_containerHeight');
    	component_subscribe($$self, _containerHeight, value => $$invalidate(6, $_containerHeight = value));
    	const _extents = writable(filterObject(extents));
    	validate_store(_extents, '_extents');
    	component_subscribe($$self, _extents, value => $$invalidate(127, $_extents = value));
    	const _data = writable(data);
    	validate_store(_data, '_data');
    	component_subscribe($$self, _data, value => $$invalidate(126, $_data = value));
    	const _flatData = writable(flatData || data);
    	validate_store(_flatData, '_flatData');
    	component_subscribe($$self, _flatData, value => $$invalidate(125, $_flatData = value));
    	const _padding = writable(padding);
    	validate_store(_padding, '_padding');
    	component_subscribe($$self, _padding, value => $$invalidate(124, $_padding = value));
    	const _x = writable(makeAccessor(x));
    	validate_store(_x, '_x');
    	component_subscribe($$self, _x, value => $$invalidate(123, $_x = value));
    	const _y = writable(makeAccessor(y));
    	validate_store(_y, '_y');
    	component_subscribe($$self, _y, value => $$invalidate(122, $_y = value));
    	const _z = writable(makeAccessor(z));
    	validate_store(_z, '_z');
    	component_subscribe($$self, _z, value => $$invalidate(121, $_z = value));
    	const _r = writable(makeAccessor(r));
    	validate_store(_r, '_r');
    	component_subscribe($$self, _r, value => $$invalidate(120, $_r = value));
    	const _xDomain = writable(xDomain);
    	validate_store(_xDomain, '_xDomain');
    	component_subscribe($$self, _xDomain, value => $$invalidate(119, $_xDomain = value));
    	const _yDomain = writable(yDomain);
    	validate_store(_yDomain, '_yDomain');
    	component_subscribe($$self, _yDomain, value => $$invalidate(118, $_yDomain = value));
    	const _zDomain = writable(zDomain);
    	validate_store(_zDomain, '_zDomain');
    	component_subscribe($$self, _zDomain, value => $$invalidate(117, $_zDomain = value));
    	const _rDomain = writable(rDomain);
    	validate_store(_rDomain, '_rDomain');
    	component_subscribe($$self, _rDomain, value => $$invalidate(116, $_rDomain = value));
    	const _xNice = writable(xNice);
    	validate_store(_xNice, '_xNice');
    	component_subscribe($$self, _xNice, value => $$invalidate(115, $_xNice = value));
    	const _yNice = writable(yNice);
    	validate_store(_yNice, '_yNice');
    	component_subscribe($$self, _yNice, value => $$invalidate(114, $_yNice = value));
    	const _zNice = writable(zNice);
    	validate_store(_zNice, '_zNice');
    	component_subscribe($$self, _zNice, value => $$invalidate(113, $_zNice = value));
    	const _rNice = writable(rNice);
    	validate_store(_rNice, '_rNice');
    	component_subscribe($$self, _rNice, value => $$invalidate(112, $_rNice = value));
    	const _xReverse = writable(xReverse);
    	validate_store(_xReverse, '_xReverse');
    	component_subscribe($$self, _xReverse, value => $$invalidate(111, $_xReverse = value));
    	const _yReverse = writable(yReverse);
    	validate_store(_yReverse, '_yReverse');
    	component_subscribe($$self, _yReverse, value => $$invalidate(110, $_yReverse = value));
    	const _zReverse = writable(zReverse);
    	validate_store(_zReverse, '_zReverse');
    	component_subscribe($$self, _zReverse, value => $$invalidate(109, $_zReverse = value));
    	const _rReverse = writable(rReverse);
    	validate_store(_rReverse, '_rReverse');
    	component_subscribe($$self, _rReverse, value => $$invalidate(108, $_rReverse = value));
    	const _xPadding = writable(xPadding);
    	validate_store(_xPadding, '_xPadding');
    	component_subscribe($$self, _xPadding, value => $$invalidate(107, $_xPadding = value));
    	const _yPadding = writable(yPadding);
    	validate_store(_yPadding, '_yPadding');
    	component_subscribe($$self, _yPadding, value => $$invalidate(106, $_yPadding = value));
    	const _zPadding = writable(zPadding);
    	validate_store(_zPadding, '_zPadding');
    	component_subscribe($$self, _zPadding, value => $$invalidate(105, $_zPadding = value));
    	const _rPadding = writable(rPadding);
    	validate_store(_rPadding, '_rPadding');
    	component_subscribe($$self, _rPadding, value => $$invalidate(104, $_rPadding = value));
    	const _xRange = writable(xRange);
    	validate_store(_xRange, '_xRange');
    	component_subscribe($$self, _xRange, value => $$invalidate(103, $_xRange = value));
    	const _yRange = writable(yRange);
    	validate_store(_yRange, '_yRange');
    	component_subscribe($$self, _yRange, value => $$invalidate(102, $_yRange = value));
    	const _zRange = writable(zRange);
    	validate_store(_zRange, '_zRange');
    	component_subscribe($$self, _zRange, value => $$invalidate(101, $_zRange = value));
    	const _rRange = writable(rRange);
    	validate_store(_rRange, '_rRange');
    	component_subscribe($$self, _rRange, value => $$invalidate(100, $_rRange = value));
    	const _xScale = writable(xScale);
    	validate_store(_xScale, '_xScale');
    	component_subscribe($$self, _xScale, value => $$invalidate(99, $_xScale = value));
    	const _yScale = writable(yScale);
    	validate_store(_yScale, '_yScale');
    	component_subscribe($$self, _yScale, value => $$invalidate(98, $_yScale = value));
    	const _zScale = writable(zScale);
    	validate_store(_zScale, '_zScale');
    	component_subscribe($$self, _zScale, value => $$invalidate(97, $_zScale = value));
    	const _rScale = writable(rScale);
    	validate_store(_rScale, '_rScale');
    	component_subscribe($$self, _rScale, value => $$invalidate(96, $_rScale = value));
    	const _config = writable(config);
    	validate_store(_config, '_config');
    	component_subscribe($$self, _config, value => $$invalidate(94, $_config = value));
    	const _custom = writable(custom);
    	validate_store(_custom, '_custom');
    	component_subscribe($$self, _custom, value => $$invalidate(95, $_custom = value));

    	/* --------------------------------------------
     * Create derived values
     * Suffix these with `_d`
     */
    	const activeGetters_d = derived([_x, _y, _z, _r], ([$x, $y, $z, $r]) => {
    		const obj = {};

    		if ($x) {
    			obj.x = $x;
    		}

    		if ($y) {
    			obj.y = $y;
    		}

    		if ($z) {
    			obj.z = $z;
    		}

    		if ($r) {
    			obj.r = $r;
    		}

    		return obj;
    	});

    	const padding_d = derived([_padding, _containerWidth, _containerHeight], ([$padding]) => {
    		const defaultPadding = { top: 0, right: 0, bottom: 0, left: 0 };
    		return Object.assign(defaultPadding, $padding);
    	});

    	const box_d = derived([_containerWidth, _containerHeight, padding_d], ([$containerWidth, $containerHeight, $padding]) => {
    		const b = {};
    		b.top = $padding.top;
    		b.right = $containerWidth - $padding.right;
    		b.bottom = $containerHeight - $padding.bottom;
    		b.left = $padding.left;
    		b.width = b.right - b.left;
    		b.height = b.bottom - b.top;

    		if (b.width <= 0 && isMounted === true) {
    			console.warn('[LayerCake] Target div has zero or negative width. Did you forget to set an explicit width in CSS on the container?');
    		}

    		if (b.height <= 0 && isMounted === true) {
    			console.warn('[LayerCake] Target div has zero or negative height. Did you forget to set an explicit height in CSS on the container?');
    		}

    		return b;
    	});

    	const width_d = derived([box_d], ([$box]) => {
    		return $box.width;
    	});

    	validate_store(width_d, 'width_d');
    	component_subscribe($$self, width_d, value => $$invalidate(8, $width_d = value));

    	const height_d = derived([box_d], ([$box]) => {
    		return $box.height;
    	});

    	validate_store(height_d, 'height_d');
    	component_subscribe($$self, height_d, value => $$invalidate(9, $height_d = value));

    	/* --------------------------------------------
     * Calculate extents by taking the extent of the data
     * and filling that in with anything set by the user
     */
    	const extents_d = derived([_flatData, activeGetters_d, _extents], ([$flatData, $activeGetters, $extents]) => {
    		const getters = filterObject($activeGetters, $extents);

    		if (Object.keys(getters).length > 0) {
    			return {
    				...calcExtents($flatData, getters),
    				...$extents
    			};
    		} else {
    			return {};
    		}
    	});

    	const xDomain_d = derived([extents_d, _xDomain], calcDomain('x'));
    	const yDomain_d = derived([extents_d, _yDomain], calcDomain('y'));
    	const zDomain_d = derived([extents_d, _zDomain], calcDomain('z'));
    	const rDomain_d = derived([extents_d, _rDomain], calcDomain('r'));

    	const xScale_d = derived(
    		[
    			_xScale,
    			extents_d,
    			xDomain_d,
    			_xPadding,
    			_xNice,
    			_xReverse,
    			width_d,
    			height_d,
    			_xRange,
    			_percentRange
    		],
    		createScale('x')
    	);

    	const xGet_d = derived([_x, xScale_d], createGetter);

    	const yScale_d = derived(
    		[
    			_yScale,
    			extents_d,
    			yDomain_d,
    			_yPadding,
    			_yNice,
    			_yReverse,
    			width_d,
    			height_d,
    			_yRange,
    			_percentRange
    		],
    		createScale('y')
    	);

    	const yGet_d = derived([_y, yScale_d], createGetter);

    	const zScale_d = derived(
    		[
    			_zScale,
    			extents_d,
    			zDomain_d,
    			_zPadding,
    			_zNice,
    			_zReverse,
    			width_d,
    			height_d,
    			_zRange,
    			_percentRange
    		],
    		createScale('z')
    	);

    	const zGet_d = derived([_z, zScale_d], createGetter);

    	const rScale_d = derived(
    		[
    			_rScale,
    			extents_d,
    			rDomain_d,
    			_rPadding,
    			_rNice,
    			_rReverse,
    			width_d,
    			height_d,
    			_rRange,
    			_percentRange
    		],
    		createScale('r')
    	);

    	const rGet_d = derived([_r, rScale_d], createGetter);
    	const xRange_d = derived([xScale_d], getRange);
    	const yRange_d = derived([yScale_d], getRange);
    	const zRange_d = derived([zScale_d], getRange);
    	const rRange_d = derived([rScale_d], getRange);

    	const aspectRatio_d = derived([width_d, height_d], ([$width, $height]) => {
    		return $width / $height;
    	});

    	validate_store(aspectRatio_d, 'aspectRatio_d');
    	component_subscribe($$self, aspectRatio_d, value => $$invalidate(10, $aspectRatio_d = value));

    	const writable_props = [
    		'ssr',
    		'pointerEvents',
    		'position',
    		'percentRange',
    		'width',
    		'height',
    		'containerWidth',
    		'containerHeight',
    		'element',
    		'x',
    		'y',
    		'z',
    		'r',
    		'data',
    		'xDomain',
    		'yDomain',
    		'zDomain',
    		'rDomain',
    		'xNice',
    		'yNice',
    		'zNice',
    		'rNice',
    		'xReverse',
    		'yReverse',
    		'zReverse',
    		'rReverse',
    		'xPadding',
    		'yPadding',
    		'zPadding',
    		'rPadding',
    		'xScale',
    		'yScale',
    		'zScale',
    		'rScale',
    		'xRange',
    		'yRange',
    		'zRange',
    		'rRange',
    		'padding',
    		'extents',
    		'flatData',
    		'custom'
    	];

    	Object_1$4.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<LayerCake> was created with unknown prop '${key}'`);
    	});

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(2, element);
    		});
    	}

    	function div_elementresize_handler() {
    		containerWidth = this.clientWidth;
    		containerHeight = this.clientHeight;
    		$$invalidate(0, containerWidth);
    		$$invalidate(1, containerHeight);
    	}

    	$$self.$$set = $$props => {
    		if ('ssr' in $$props) $$invalidate(3, ssr = $$props.ssr);
    		if ('pointerEvents' in $$props) $$invalidate(4, pointerEvents = $$props.pointerEvents);
    		if ('position' in $$props) $$invalidate(5, position = $$props.position);
    		if ('percentRange' in $$props) $$invalidate(51, percentRange = $$props.percentRange);
    		if ('width' in $$props) $$invalidate(52, width = $$props.width);
    		if ('height' in $$props) $$invalidate(53, height = $$props.height);
    		if ('containerWidth' in $$props) $$invalidate(0, containerWidth = $$props.containerWidth);
    		if ('containerHeight' in $$props) $$invalidate(1, containerHeight = $$props.containerHeight);
    		if ('element' in $$props) $$invalidate(2, element = $$props.element);
    		if ('x' in $$props) $$invalidate(54, x = $$props.x);
    		if ('y' in $$props) $$invalidate(55, y = $$props.y);
    		if ('z' in $$props) $$invalidate(56, z = $$props.z);
    		if ('r' in $$props) $$invalidate(57, r = $$props.r);
    		if ('data' in $$props) $$invalidate(58, data = $$props.data);
    		if ('xDomain' in $$props) $$invalidate(59, xDomain = $$props.xDomain);
    		if ('yDomain' in $$props) $$invalidate(60, yDomain = $$props.yDomain);
    		if ('zDomain' in $$props) $$invalidate(61, zDomain = $$props.zDomain);
    		if ('rDomain' in $$props) $$invalidate(62, rDomain = $$props.rDomain);
    		if ('xNice' in $$props) $$invalidate(63, xNice = $$props.xNice);
    		if ('yNice' in $$props) $$invalidate(64, yNice = $$props.yNice);
    		if ('zNice' in $$props) $$invalidate(65, zNice = $$props.zNice);
    		if ('rNice' in $$props) $$invalidate(66, rNice = $$props.rNice);
    		if ('xReverse' in $$props) $$invalidate(67, xReverse = $$props.xReverse);
    		if ('yReverse' in $$props) $$invalidate(68, yReverse = $$props.yReverse);
    		if ('zReverse' in $$props) $$invalidate(69, zReverse = $$props.zReverse);
    		if ('rReverse' in $$props) $$invalidate(70, rReverse = $$props.rReverse);
    		if ('xPadding' in $$props) $$invalidate(71, xPadding = $$props.xPadding);
    		if ('yPadding' in $$props) $$invalidate(72, yPadding = $$props.yPadding);
    		if ('zPadding' in $$props) $$invalidate(73, zPadding = $$props.zPadding);
    		if ('rPadding' in $$props) $$invalidate(74, rPadding = $$props.rPadding);
    		if ('xScale' in $$props) $$invalidate(75, xScale = $$props.xScale);
    		if ('yScale' in $$props) $$invalidate(76, yScale = $$props.yScale);
    		if ('zScale' in $$props) $$invalidate(77, zScale = $$props.zScale);
    		if ('rScale' in $$props) $$invalidate(78, rScale = $$props.rScale);
    		if ('xRange' in $$props) $$invalidate(79, xRange = $$props.xRange);
    		if ('yRange' in $$props) $$invalidate(80, yRange = $$props.yRange);
    		if ('zRange' in $$props) $$invalidate(81, zRange = $$props.zRange);
    		if ('rRange' in $$props) $$invalidate(82, rRange = $$props.rRange);
    		if ('padding' in $$props) $$invalidate(83, padding = $$props.padding);
    		if ('extents' in $$props) $$invalidate(84, extents = $$props.extents);
    		if ('flatData' in $$props) $$invalidate(85, flatData = $$props.flatData);
    		if ('custom' in $$props) $$invalidate(86, custom = $$props.custom);
    		if ('$$scope' in $$props) $$invalidate(89, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		setContext,
    		onMount,
    		writable,
    		derived,
    		makeAccessor,
    		filterObject,
    		calcExtents,
    		calcDomain,
    		createScale,
    		createGetter,
    		getRange,
    		defaultScales,
    		defaultReverses,
    		ssr,
    		pointerEvents,
    		position,
    		percentRange,
    		width,
    		height,
    		containerWidth,
    		containerHeight,
    		element,
    		x,
    		y,
    		z,
    		r,
    		data,
    		xDomain,
    		yDomain,
    		zDomain,
    		rDomain,
    		xNice,
    		yNice,
    		zNice,
    		rNice,
    		xReverse,
    		yReverse,
    		zReverse,
    		rReverse,
    		xPadding,
    		yPadding,
    		zPadding,
    		rPadding,
    		xScale,
    		yScale,
    		zScale,
    		rScale,
    		xRange,
    		yRange,
    		zRange,
    		rRange,
    		padding,
    		extents,
    		flatData,
    		custom,
    		isMounted,
    		config,
    		_percentRange,
    		_containerWidth,
    		_containerHeight,
    		_extents,
    		_data,
    		_flatData,
    		_padding,
    		_x,
    		_y,
    		_z,
    		_r,
    		_xDomain,
    		_yDomain,
    		_zDomain,
    		_rDomain,
    		_xNice,
    		_yNice,
    		_zNice,
    		_rNice,
    		_xReverse,
    		_yReverse,
    		_zReverse,
    		_rReverse,
    		_xPadding,
    		_yPadding,
    		_zPadding,
    		_rPadding,
    		_xRange,
    		_yRange,
    		_zRange,
    		_rRange,
    		_xScale,
    		_yScale,
    		_zScale,
    		_rScale,
    		_config,
    		_custom,
    		activeGetters_d,
    		padding_d,
    		box_d,
    		width_d,
    		height_d,
    		extents_d,
    		xDomain_d,
    		yDomain_d,
    		zDomain_d,
    		rDomain_d,
    		xScale_d,
    		xGet_d,
    		yScale_d,
    		yGet_d,
    		zScale_d,
    		zGet_d,
    		rScale_d,
    		rGet_d,
    		xRange_d,
    		yRange_d,
    		zRange_d,
    		rRange_d,
    		aspectRatio_d,
    		context,
    		$_config,
    		$_custom,
    		$_rScale,
    		$_zScale,
    		$_yScale,
    		$_xScale,
    		$_rRange,
    		$_zRange,
    		$_yRange,
    		$_xRange,
    		$_rPadding,
    		$_zPadding,
    		$_yPadding,
    		$_xPadding,
    		$_rReverse,
    		$_zReverse,
    		$_yReverse,
    		$_xReverse,
    		$_rNice,
    		$_zNice,
    		$_yNice,
    		$_xNice,
    		$_rDomain,
    		$_zDomain,
    		$_yDomain,
    		$_xDomain,
    		$_r,
    		$_z,
    		$_y,
    		$_x,
    		$_padding,
    		$_flatData,
    		$_data,
    		$_extents,
    		$_containerHeight,
    		$_containerWidth,
    		$_percentRange,
    		$width_d,
    		$height_d,
    		$aspectRatio_d
    	});

    	$$self.$inject_state = $$props => {
    		if ('ssr' in $$props) $$invalidate(3, ssr = $$props.ssr);
    		if ('pointerEvents' in $$props) $$invalidate(4, pointerEvents = $$props.pointerEvents);
    		if ('position' in $$props) $$invalidate(5, position = $$props.position);
    		if ('percentRange' in $$props) $$invalidate(51, percentRange = $$props.percentRange);
    		if ('width' in $$props) $$invalidate(52, width = $$props.width);
    		if ('height' in $$props) $$invalidate(53, height = $$props.height);
    		if ('containerWidth' in $$props) $$invalidate(0, containerWidth = $$props.containerWidth);
    		if ('containerHeight' in $$props) $$invalidate(1, containerHeight = $$props.containerHeight);
    		if ('element' in $$props) $$invalidate(2, element = $$props.element);
    		if ('x' in $$props) $$invalidate(54, x = $$props.x);
    		if ('y' in $$props) $$invalidate(55, y = $$props.y);
    		if ('z' in $$props) $$invalidate(56, z = $$props.z);
    		if ('r' in $$props) $$invalidate(57, r = $$props.r);
    		if ('data' in $$props) $$invalidate(58, data = $$props.data);
    		if ('xDomain' in $$props) $$invalidate(59, xDomain = $$props.xDomain);
    		if ('yDomain' in $$props) $$invalidate(60, yDomain = $$props.yDomain);
    		if ('zDomain' in $$props) $$invalidate(61, zDomain = $$props.zDomain);
    		if ('rDomain' in $$props) $$invalidate(62, rDomain = $$props.rDomain);
    		if ('xNice' in $$props) $$invalidate(63, xNice = $$props.xNice);
    		if ('yNice' in $$props) $$invalidate(64, yNice = $$props.yNice);
    		if ('zNice' in $$props) $$invalidate(65, zNice = $$props.zNice);
    		if ('rNice' in $$props) $$invalidate(66, rNice = $$props.rNice);
    		if ('xReverse' in $$props) $$invalidate(67, xReverse = $$props.xReverse);
    		if ('yReverse' in $$props) $$invalidate(68, yReverse = $$props.yReverse);
    		if ('zReverse' in $$props) $$invalidate(69, zReverse = $$props.zReverse);
    		if ('rReverse' in $$props) $$invalidate(70, rReverse = $$props.rReverse);
    		if ('xPadding' in $$props) $$invalidate(71, xPadding = $$props.xPadding);
    		if ('yPadding' in $$props) $$invalidate(72, yPadding = $$props.yPadding);
    		if ('zPadding' in $$props) $$invalidate(73, zPadding = $$props.zPadding);
    		if ('rPadding' in $$props) $$invalidate(74, rPadding = $$props.rPadding);
    		if ('xScale' in $$props) $$invalidate(75, xScale = $$props.xScale);
    		if ('yScale' in $$props) $$invalidate(76, yScale = $$props.yScale);
    		if ('zScale' in $$props) $$invalidate(77, zScale = $$props.zScale);
    		if ('rScale' in $$props) $$invalidate(78, rScale = $$props.rScale);
    		if ('xRange' in $$props) $$invalidate(79, xRange = $$props.xRange);
    		if ('yRange' in $$props) $$invalidate(80, yRange = $$props.yRange);
    		if ('zRange' in $$props) $$invalidate(81, zRange = $$props.zRange);
    		if ('rRange' in $$props) $$invalidate(82, rRange = $$props.rRange);
    		if ('padding' in $$props) $$invalidate(83, padding = $$props.padding);
    		if ('extents' in $$props) $$invalidate(84, extents = $$props.extents);
    		if ('flatData' in $$props) $$invalidate(85, flatData = $$props.flatData);
    		if ('custom' in $$props) $$invalidate(86, custom = $$props.custom);
    		if ('isMounted' in $$props) isMounted = $$props.isMounted;
    		if ('context' in $$props) $$invalidate(88, context = $$props.context);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[1] & /*x*/ 8388608) {
    			if (x) $$invalidate(87, config.x = x, config);
    		}

    		if ($$self.$$.dirty[1] & /*y*/ 16777216) {
    			if (y) $$invalidate(87, config.y = y, config);
    		}

    		if ($$self.$$.dirty[1] & /*z*/ 33554432) {
    			if (z) $$invalidate(87, config.z = z, config);
    		}

    		if ($$self.$$.dirty[1] & /*r*/ 67108864) {
    			if (r) $$invalidate(87, config.r = r, config);
    		}

    		if ($$self.$$.dirty[1] & /*xDomain*/ 268435456) {
    			if (xDomain) $$invalidate(87, config.xDomain = xDomain, config);
    		}

    		if ($$self.$$.dirty[1] & /*yDomain*/ 536870912) {
    			if (yDomain) $$invalidate(87, config.yDomain = yDomain, config);
    		}

    		if ($$self.$$.dirty[1] & /*zDomain*/ 1073741824) {
    			if (zDomain) $$invalidate(87, config.zDomain = zDomain, config);
    		}

    		if ($$self.$$.dirty[2] & /*rDomain*/ 1) {
    			if (rDomain) $$invalidate(87, config.rDomain = rDomain, config);
    		}

    		if ($$self.$$.dirty[2] & /*xRange*/ 131072) {
    			if (xRange) $$invalidate(87, config.xRange = xRange, config);
    		}

    		if ($$self.$$.dirty[2] & /*yRange*/ 262144) {
    			if (yRange) $$invalidate(87, config.yRange = yRange, config);
    		}

    		if ($$self.$$.dirty[2] & /*zRange*/ 524288) {
    			if (zRange) $$invalidate(87, config.zRange = zRange, config);
    		}

    		if ($$self.$$.dirty[2] & /*rRange*/ 1048576) {
    			if (rRange) $$invalidate(87, config.rRange = rRange, config);
    		}

    		if ($$self.$$.dirty[1] & /*percentRange*/ 1048576) {
    			set_store_value(_percentRange, $_percentRange = percentRange, $_percentRange);
    		}

    		if ($$self.$$.dirty[0] & /*containerWidth*/ 1) {
    			set_store_value(_containerWidth, $_containerWidth = containerWidth, $_containerWidth);
    		}

    		if ($$self.$$.dirty[0] & /*containerHeight*/ 2) {
    			set_store_value(_containerHeight, $_containerHeight = containerHeight, $_containerHeight);
    		}

    		if ($$self.$$.dirty[2] & /*extents*/ 4194304) {
    			set_store_value(_extents, $_extents = filterObject(extents), $_extents);
    		}

    		if ($$self.$$.dirty[1] & /*data*/ 134217728) {
    			set_store_value(_data, $_data = data, $_data);
    		}

    		if ($$self.$$.dirty[1] & /*data*/ 134217728 | $$self.$$.dirty[2] & /*flatData*/ 8388608) {
    			set_store_value(_flatData, $_flatData = flatData || data, $_flatData);
    		}

    		if ($$self.$$.dirty[2] & /*padding*/ 2097152) {
    			set_store_value(_padding, $_padding = padding, $_padding);
    		}

    		if ($$self.$$.dirty[1] & /*x*/ 8388608) {
    			set_store_value(_x, $_x = makeAccessor(x), $_x);
    		}

    		if ($$self.$$.dirty[1] & /*y*/ 16777216) {
    			set_store_value(_y, $_y = makeAccessor(y), $_y);
    		}

    		if ($$self.$$.dirty[1] & /*z*/ 33554432) {
    			set_store_value(_z, $_z = makeAccessor(z), $_z);
    		}

    		if ($$self.$$.dirty[1] & /*r*/ 67108864) {
    			set_store_value(_r, $_r = makeAccessor(r), $_r);
    		}

    		if ($$self.$$.dirty[1] & /*xDomain*/ 268435456) {
    			set_store_value(_xDomain, $_xDomain = xDomain, $_xDomain);
    		}

    		if ($$self.$$.dirty[1] & /*yDomain*/ 536870912) {
    			set_store_value(_yDomain, $_yDomain = yDomain, $_yDomain);
    		}

    		if ($$self.$$.dirty[1] & /*zDomain*/ 1073741824) {
    			set_store_value(_zDomain, $_zDomain = zDomain, $_zDomain);
    		}

    		if ($$self.$$.dirty[2] & /*rDomain*/ 1) {
    			set_store_value(_rDomain, $_rDomain = rDomain, $_rDomain);
    		}

    		if ($$self.$$.dirty[2] & /*xNice*/ 2) {
    			set_store_value(_xNice, $_xNice = xNice, $_xNice);
    		}

    		if ($$self.$$.dirty[2] & /*yNice*/ 4) {
    			set_store_value(_yNice, $_yNice = yNice, $_yNice);
    		}

    		if ($$self.$$.dirty[2] & /*zNice*/ 8) {
    			set_store_value(_zNice, $_zNice = zNice, $_zNice);
    		}

    		if ($$self.$$.dirty[2] & /*rNice*/ 16) {
    			set_store_value(_rNice, $_rNice = rNice, $_rNice);
    		}

    		if ($$self.$$.dirty[2] & /*xReverse*/ 32) {
    			set_store_value(_xReverse, $_xReverse = xReverse, $_xReverse);
    		}

    		if ($$self.$$.dirty[2] & /*yReverse*/ 64) {
    			set_store_value(_yReverse, $_yReverse = yReverse, $_yReverse);
    		}

    		if ($$self.$$.dirty[2] & /*zReverse*/ 128) {
    			set_store_value(_zReverse, $_zReverse = zReverse, $_zReverse);
    		}

    		if ($$self.$$.dirty[2] & /*rReverse*/ 256) {
    			set_store_value(_rReverse, $_rReverse = rReverse, $_rReverse);
    		}

    		if ($$self.$$.dirty[2] & /*xPadding*/ 512) {
    			set_store_value(_xPadding, $_xPadding = xPadding, $_xPadding);
    		}

    		if ($$self.$$.dirty[2] & /*yPadding*/ 1024) {
    			set_store_value(_yPadding, $_yPadding = yPadding, $_yPadding);
    		}

    		if ($$self.$$.dirty[2] & /*zPadding*/ 2048) {
    			set_store_value(_zPadding, $_zPadding = zPadding, $_zPadding);
    		}

    		if ($$self.$$.dirty[2] & /*rPadding*/ 4096) {
    			set_store_value(_rPadding, $_rPadding = rPadding, $_rPadding);
    		}

    		if ($$self.$$.dirty[2] & /*xRange*/ 131072) {
    			set_store_value(_xRange, $_xRange = xRange, $_xRange);
    		}

    		if ($$self.$$.dirty[2] & /*yRange*/ 262144) {
    			set_store_value(_yRange, $_yRange = yRange, $_yRange);
    		}

    		if ($$self.$$.dirty[2] & /*zRange*/ 524288) {
    			set_store_value(_zRange, $_zRange = zRange, $_zRange);
    		}

    		if ($$self.$$.dirty[2] & /*rRange*/ 1048576) {
    			set_store_value(_rRange, $_rRange = rRange, $_rRange);
    		}

    		if ($$self.$$.dirty[2] & /*xScale*/ 8192) {
    			set_store_value(_xScale, $_xScale = xScale, $_xScale);
    		}

    		if ($$self.$$.dirty[2] & /*yScale*/ 16384) {
    			set_store_value(_yScale, $_yScale = yScale, $_yScale);
    		}

    		if ($$self.$$.dirty[2] & /*zScale*/ 32768) {
    			set_store_value(_zScale, $_zScale = zScale, $_zScale);
    		}

    		if ($$self.$$.dirty[2] & /*rScale*/ 65536) {
    			set_store_value(_rScale, $_rScale = rScale, $_rScale);
    		}

    		if ($$self.$$.dirty[2] & /*custom*/ 16777216) {
    			set_store_value(_custom, $_custom = custom, $_custom);
    		}

    		if ($$self.$$.dirty[2] & /*config*/ 33554432) {
    			set_store_value(_config, $_config = config, $_config);
    		}

    		if ($$self.$$.dirty[2] & /*context*/ 67108864) {
    			setContext('LayerCake', context);
    		}
    	};

    	$$invalidate(88, context = {
    		activeGetters: activeGetters_d,
    		width: width_d,
    		height: height_d,
    		percentRange: _percentRange,
    		aspectRatio: aspectRatio_d,
    		containerWidth: _containerWidth,
    		containerHeight: _containerHeight,
    		x: _x,
    		y: _y,
    		z: _z,
    		r: _r,
    		custom: _custom,
    		data: _data,
    		xNice: _xNice,
    		yNice: _yNice,
    		zNice: _zNice,
    		rNice: _rNice,
    		xReverse: _xReverse,
    		yReverse: _yReverse,
    		zReverse: _zReverse,
    		rReverse: _rReverse,
    		xPadding: _xPadding,
    		yPadding: _yPadding,
    		zPadding: _zPadding,
    		rPadding: _rPadding,
    		padding: padding_d,
    		flatData: _flatData,
    		extents: extents_d,
    		xDomain: xDomain_d,
    		yDomain: yDomain_d,
    		zDomain: zDomain_d,
    		rDomain: rDomain_d,
    		xRange: xRange_d,
    		yRange: yRange_d,
    		zRange: zRange_d,
    		rRange: rRange_d,
    		config: _config,
    		xScale: xScale_d,
    		xGet: xGet_d,
    		yScale: yScale_d,
    		yGet: yGet_d,
    		zScale: zScale_d,
    		zGet: zGet_d,
    		rScale: rScale_d,
    		rGet: rGet_d
    	});

    	return [
    		containerWidth,
    		containerHeight,
    		element,
    		ssr,
    		pointerEvents,
    		position,
    		$_containerHeight,
    		$_containerWidth,
    		$width_d,
    		$height_d,
    		$aspectRatio_d,
    		_percentRange,
    		_containerWidth,
    		_containerHeight,
    		_extents,
    		_data,
    		_flatData,
    		_padding,
    		_x,
    		_y,
    		_z,
    		_r,
    		_xDomain,
    		_yDomain,
    		_zDomain,
    		_rDomain,
    		_xNice,
    		_yNice,
    		_zNice,
    		_rNice,
    		_xReverse,
    		_yReverse,
    		_zReverse,
    		_rReverse,
    		_xPadding,
    		_yPadding,
    		_zPadding,
    		_rPadding,
    		_xRange,
    		_yRange,
    		_zRange,
    		_rRange,
    		_xScale,
    		_yScale,
    		_zScale,
    		_rScale,
    		_config,
    		_custom,
    		width_d,
    		height_d,
    		aspectRatio_d,
    		percentRange,
    		width,
    		height,
    		x,
    		y,
    		z,
    		r,
    		data,
    		xDomain,
    		yDomain,
    		zDomain,
    		rDomain,
    		xNice,
    		yNice,
    		zNice,
    		rNice,
    		xReverse,
    		yReverse,
    		zReverse,
    		rReverse,
    		xPadding,
    		yPadding,
    		zPadding,
    		rPadding,
    		xScale,
    		yScale,
    		zScale,
    		rScale,
    		xRange,
    		yRange,
    		zRange,
    		rRange,
    		padding,
    		extents,
    		flatData,
    		custom,
    		config,
    		context,
    		$$scope,
    		slots,
    		div_binding,
    		div_elementresize_handler
    	];
    }

    class LayerCake extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$y,
    			create_fragment$y,
    			safe_not_equal,
    			{
    				ssr: 3,
    				pointerEvents: 4,
    				position: 5,
    				percentRange: 51,
    				width: 52,
    				height: 53,
    				containerWidth: 0,
    				containerHeight: 1,
    				element: 2,
    				x: 54,
    				y: 55,
    				z: 56,
    				r: 57,
    				data: 58,
    				xDomain: 59,
    				yDomain: 60,
    				zDomain: 61,
    				rDomain: 62,
    				xNice: 63,
    				yNice: 64,
    				zNice: 65,
    				rNice: 66,
    				xReverse: 67,
    				yReverse: 68,
    				zReverse: 69,
    				rReverse: 70,
    				xPadding: 71,
    				yPadding: 72,
    				zPadding: 73,
    				rPadding: 74,
    				xScale: 75,
    				yScale: 76,
    				zScale: 77,
    				rScale: 78,
    				xRange: 79,
    				yRange: 80,
    				zRange: 81,
    				rRange: 82,
    				padding: 83,
    				extents: 84,
    				flatData: 85,
    				custom: 86
    			},
    			null,
    			[-1, -1, -1, -1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LayerCake",
    			options,
    			id: create_fragment$y.name
    		});
    	}

    	get ssr() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ssr(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pointerEvents() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pointerEvents(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get position() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set position(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get percentRange() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set percentRange(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get containerWidth() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set containerWidth(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get containerHeight() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set containerHeight(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get element() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set element(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get x() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set x(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get y() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set y(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get z() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set z(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get r() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set r(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get data() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xDomain() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xDomain(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get yDomain() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set yDomain(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get zDomain() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set zDomain(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rDomain() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rDomain(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xNice() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xNice(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get yNice() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set yNice(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get zNice() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set zNice(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rNice() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rNice(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xReverse() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xReverse(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get yReverse() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set yReverse(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get zReverse() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set zReverse(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rReverse() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rReverse(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xPadding() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xPadding(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get yPadding() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set yPadding(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get zPadding() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set zPadding(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rPadding() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rPadding(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xScale() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xScale(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get yScale() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set yScale(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get zScale() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set zScale(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rScale() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rScale(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xRange() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xRange(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get yRange() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set yRange(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get zRange() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set zRange(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rRange() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rRange(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get padding() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set padding(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get extents() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set extents(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get flatData() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set flatData(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get custom() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set custom(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/layercake/layouts/Html.svelte generated by Svelte v3.49.0 */
    const file$w = "node_modules/layercake/layouts/Html.svelte";
    const get_default_slot_changes$3 = dirty => ({ element: dirty & /*element*/ 1 });
    const get_default_slot_context$3 = ctx => ({ element: /*element*/ ctx[0] });

    function create_fragment$x(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], get_default_slot_context$3);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "layercake-layout-html svelte-1bu60uu");
    			set_style(div, "z-index", /*zIndex*/ ctx[1], false);
    			set_style(div, "pointer-events", /*pointerEvents*/ ctx[2] === false ? 'none' : null, false);
    			set_style(div, "top", /*$padding*/ ctx[3].top + 'px', false);
    			set_style(div, "right", /*$padding*/ ctx[3].right + 'px', false);
    			set_style(div, "bottom", /*$padding*/ ctx[3].bottom + 'px', false);
    			set_style(div, "left", /*$padding*/ ctx[3].left + 'px', false);
    			add_location(div, file$w, 19, 0, 512);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			/*div_binding*/ ctx[7](div);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, element*/ 33)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[5],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[5])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[5], dirty, get_default_slot_changes$3),
    						get_default_slot_context$3
    					);
    				}
    			}

    			if (dirty & /*zIndex*/ 2) {
    				set_style(div, "z-index", /*zIndex*/ ctx[1], false);
    			}

    			if (dirty & /*pointerEvents*/ 4) {
    				set_style(div, "pointer-events", /*pointerEvents*/ ctx[2] === false ? 'none' : null, false);
    			}

    			if (dirty & /*$padding*/ 8) {
    				set_style(div, "top", /*$padding*/ ctx[3].top + 'px', false);
    			}

    			if (dirty & /*$padding*/ 8) {
    				set_style(div, "right", /*$padding*/ ctx[3].right + 'px', false);
    			}

    			if (dirty & /*$padding*/ 8) {
    				set_style(div, "bottom", /*$padding*/ ctx[3].bottom + 'px', false);
    			}

    			if (dirty & /*$padding*/ 8) {
    				set_style(div, "left", /*$padding*/ ctx[3].left + 'px', false);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			/*div_binding*/ ctx[7](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$x.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$x($$self, $$props, $$invalidate) {
    	let $padding;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Html', slots, ['default']);
    	let { element = undefined } = $$props;
    	let { zIndex = undefined } = $$props;
    	let { pointerEvents = undefined } = $$props;
    	const { padding } = getContext('LayerCake');
    	validate_store(padding, 'padding');
    	component_subscribe($$self, padding, value => $$invalidate(3, $padding = value));
    	const writable_props = ['element', 'zIndex', 'pointerEvents'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Html> was created with unknown prop '${key}'`);
    	});

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(0, element);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('element' in $$props) $$invalidate(0, element = $$props.element);
    		if ('zIndex' in $$props) $$invalidate(1, zIndex = $$props.zIndex);
    		if ('pointerEvents' in $$props) $$invalidate(2, pointerEvents = $$props.pointerEvents);
    		if ('$$scope' in $$props) $$invalidate(5, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		element,
    		zIndex,
    		pointerEvents,
    		padding,
    		$padding
    	});

    	$$self.$inject_state = $$props => {
    		if ('element' in $$props) $$invalidate(0, element = $$props.element);
    		if ('zIndex' in $$props) $$invalidate(1, zIndex = $$props.zIndex);
    		if ('pointerEvents' in $$props) $$invalidate(2, pointerEvents = $$props.pointerEvents);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [element, zIndex, pointerEvents, $padding, padding, $$scope, slots, div_binding];
    }

    class Html extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$x, create_fragment$x, safe_not_equal, { element: 0, zIndex: 1, pointerEvents: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Html",
    			options,
    			id: create_fragment$x.name
    		});
    	}

    	get element() {
    		throw new Error("<Html>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set element(value) {
    		throw new Error("<Html>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get zIndex() {
    		throw new Error("<Html>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set zIndex(value) {
    		throw new Error("<Html>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pointerEvents() {
    		throw new Error("<Html>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pointerEvents(value) {
    		throw new Error("<Html>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/layercake/layouts/Svg.svelte generated by Svelte v3.49.0 */
    const file$v = "node_modules/layercake/layouts/Svg.svelte";
    const get_default_slot_changes$2 = dirty => ({ element: dirty & /*element*/ 1 });
    const get_default_slot_context$2 = ctx => ({ element: /*element*/ ctx[0] });
    const get_defs_slot_changes = dirty => ({ element: dirty & /*element*/ 1 });
    const get_defs_slot_context = ctx => ({ element: /*element*/ ctx[0] });

    function create_fragment$w(ctx) {
    	let svg;
    	let defs;
    	let g;
    	let g_transform_value;
    	let current;
    	const defs_slot_template = /*#slots*/ ctx[12].defs;
    	const defs_slot = create_slot(defs_slot_template, ctx, /*$$scope*/ ctx[11], get_defs_slot_context);
    	const default_slot_template = /*#slots*/ ctx[12].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[11], get_default_slot_context$2);

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			defs = svg_element("defs");
    			if (defs_slot) defs_slot.c();
    			g = svg_element("g");
    			if (default_slot) default_slot.c();
    			add_location(defs, file$v, 33, 1, 992);
    			attr_dev(g, "class", "layercake-layout-svg_g");
    			attr_dev(g, "transform", g_transform_value = "translate(" + /*$padding*/ ctx[7].left + ", " + /*$padding*/ ctx[7].top + ")");
    			add_location(g, file$v, 36, 1, 1037);
    			attr_dev(svg, "class", "layercake-layout-svg svelte-u84d8d");
    			attr_dev(svg, "viewBox", /*viewBox*/ ctx[4]);
    			attr_dev(svg, "width", /*$containerWidth*/ ctx[5]);
    			attr_dev(svg, "height", /*$containerHeight*/ ctx[6]);
    			set_style(svg, "z-index", /*zIndex*/ ctx[2], false);
    			set_style(svg, "pointer-events", /*pointerEvents*/ ctx[3] === false ? 'none' : null, false);
    			add_location(svg, file$v, 24, 0, 782);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, defs);

    			if (defs_slot) {
    				defs_slot.m(defs, null);
    			}

    			append_dev(svg, g);

    			if (default_slot) {
    				default_slot.m(g, null);
    			}

    			/*g_binding*/ ctx[13](g);
    			/*svg_binding*/ ctx[14](svg);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (defs_slot) {
    				if (defs_slot.p && (!current || dirty & /*$$scope, element*/ 2049)) {
    					update_slot_base(
    						defs_slot,
    						defs_slot_template,
    						ctx,
    						/*$$scope*/ ctx[11],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[11])
    						: get_slot_changes(defs_slot_template, /*$$scope*/ ctx[11], dirty, get_defs_slot_changes),
    						get_defs_slot_context
    					);
    				}
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, element*/ 2049)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[11],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[11])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[11], dirty, get_default_slot_changes$2),
    						get_default_slot_context$2
    					);
    				}
    			}

    			if (!current || dirty & /*$padding*/ 128 && g_transform_value !== (g_transform_value = "translate(" + /*$padding*/ ctx[7].left + ", " + /*$padding*/ ctx[7].top + ")")) {
    				attr_dev(g, "transform", g_transform_value);
    			}

    			if (!current || dirty & /*viewBox*/ 16) {
    				attr_dev(svg, "viewBox", /*viewBox*/ ctx[4]);
    			}

    			if (!current || dirty & /*$containerWidth*/ 32) {
    				attr_dev(svg, "width", /*$containerWidth*/ ctx[5]);
    			}

    			if (!current || dirty & /*$containerHeight*/ 64) {
    				attr_dev(svg, "height", /*$containerHeight*/ ctx[6]);
    			}

    			if (dirty & /*zIndex*/ 4) {
    				set_style(svg, "z-index", /*zIndex*/ ctx[2], false);
    			}

    			if (dirty & /*pointerEvents*/ 8) {
    				set_style(svg, "pointer-events", /*pointerEvents*/ ctx[3] === false ? 'none' : null, false);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(defs_slot, local);
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(defs_slot, local);
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if (defs_slot) defs_slot.d(detaching);
    			if (default_slot) default_slot.d(detaching);
    			/*g_binding*/ ctx[13](null);
    			/*svg_binding*/ ctx[14](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$w.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$w($$self, $$props, $$invalidate) {
    	let $containerWidth;
    	let $containerHeight;
    	let $padding;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Svg', slots, ['defs','default']);
    	let { element = undefined } = $$props;
    	let { innerElement = undefined } = $$props;
    	let { zIndex = undefined } = $$props;
    	let { pointerEvents = undefined } = $$props;
    	let { viewBox = undefined } = $$props;
    	const { containerWidth, containerHeight, padding } = getContext('LayerCake');
    	validate_store(containerWidth, 'containerWidth');
    	component_subscribe($$self, containerWidth, value => $$invalidate(5, $containerWidth = value));
    	validate_store(containerHeight, 'containerHeight');
    	component_subscribe($$self, containerHeight, value => $$invalidate(6, $containerHeight = value));
    	validate_store(padding, 'padding');
    	component_subscribe($$self, padding, value => $$invalidate(7, $padding = value));
    	const writable_props = ['element', 'innerElement', 'zIndex', 'pointerEvents', 'viewBox'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Svg> was created with unknown prop '${key}'`);
    	});

    	function g_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			innerElement = $$value;
    			$$invalidate(1, innerElement);
    		});
    	}

    	function svg_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(0, element);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('element' in $$props) $$invalidate(0, element = $$props.element);
    		if ('innerElement' in $$props) $$invalidate(1, innerElement = $$props.innerElement);
    		if ('zIndex' in $$props) $$invalidate(2, zIndex = $$props.zIndex);
    		if ('pointerEvents' in $$props) $$invalidate(3, pointerEvents = $$props.pointerEvents);
    		if ('viewBox' in $$props) $$invalidate(4, viewBox = $$props.viewBox);
    		if ('$$scope' in $$props) $$invalidate(11, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		element,
    		innerElement,
    		zIndex,
    		pointerEvents,
    		viewBox,
    		containerWidth,
    		containerHeight,
    		padding,
    		$containerWidth,
    		$containerHeight,
    		$padding
    	});

    	$$self.$inject_state = $$props => {
    		if ('element' in $$props) $$invalidate(0, element = $$props.element);
    		if ('innerElement' in $$props) $$invalidate(1, innerElement = $$props.innerElement);
    		if ('zIndex' in $$props) $$invalidate(2, zIndex = $$props.zIndex);
    		if ('pointerEvents' in $$props) $$invalidate(3, pointerEvents = $$props.pointerEvents);
    		if ('viewBox' in $$props) $$invalidate(4, viewBox = $$props.viewBox);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		element,
    		innerElement,
    		zIndex,
    		pointerEvents,
    		viewBox,
    		$containerWidth,
    		$containerHeight,
    		$padding,
    		containerWidth,
    		containerHeight,
    		padding,
    		$$scope,
    		slots,
    		g_binding,
    		svg_binding
    	];
    }

    class Svg extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$w, create_fragment$w, safe_not_equal, {
    			element: 0,
    			innerElement: 1,
    			zIndex: 2,
    			pointerEvents: 3,
    			viewBox: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Svg",
    			options,
    			id: create_fragment$w.name
    		});
    	}

    	get element() {
    		throw new Error("<Svg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set element(value) {
    		throw new Error("<Svg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get innerElement() {
    		throw new Error("<Svg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set innerElement(value) {
    		throw new Error("<Svg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get zIndex() {
    		throw new Error("<Svg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set zIndex(value) {
    		throw new Error("<Svg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pointerEvents() {
    		throw new Error("<Svg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pointerEvents(value) {
    		throw new Error("<Svg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get viewBox() {
    		throw new Error("<Svg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set viewBox(value) {
    		throw new Error("<Svg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /**
    	Flatten arrays of arrays one level deep
    	@param {Array} list The list to flatten.
    	@returns {Array}
    */
    function flatten (list) {
    	if (Array.isArray(list) && Array.isArray(list[0])) {
    		let flat = [];
    		const l = list.length;
    		for (let i = 0; i < l; i += 1) {
    			flat = flat.concat(list[i]);
    		}
    		return flat;
    	}
    	return list;
    }

    function tree_add(d) {
      const x = +this._x.call(null, d),
          y = +this._y.call(null, d);
      return add(this.cover(x, y), x, y, d);
    }

    function add(tree, x, y, d) {
      if (isNaN(x) || isNaN(y)) return tree; // ignore invalid points

      var parent,
          node = tree._root,
          leaf = {data: d},
          x0 = tree._x0,
          y0 = tree._y0,
          x1 = tree._x1,
          y1 = tree._y1,
          xm,
          ym,
          xp,
          yp,
          right,
          bottom,
          i,
          j;

      // If the tree is empty, initialize the root as a leaf.
      if (!node) return tree._root = leaf, tree;

      // Find the existing leaf for the new point, or add it.
      while (node.length) {
        if (right = x >= (xm = (x0 + x1) / 2)) x0 = xm; else x1 = xm;
        if (bottom = y >= (ym = (y0 + y1) / 2)) y0 = ym; else y1 = ym;
        if (parent = node, !(node = node[i = bottom << 1 | right])) return parent[i] = leaf, tree;
      }

      // Is the new point is exactly coincident with the existing point?
      xp = +tree._x.call(null, node.data);
      yp = +tree._y.call(null, node.data);
      if (x === xp && y === yp) return leaf.next = node, parent ? parent[i] = leaf : tree._root = leaf, tree;

      // Otherwise, split the leaf node until the old and new point are separated.
      do {
        parent = parent ? parent[i] = new Array(4) : tree._root = new Array(4);
        if (right = x >= (xm = (x0 + x1) / 2)) x0 = xm; else x1 = xm;
        if (bottom = y >= (ym = (y0 + y1) / 2)) y0 = ym; else y1 = ym;
      } while ((i = bottom << 1 | right) === (j = (yp >= ym) << 1 | (xp >= xm)));
      return parent[j] = node, parent[i] = leaf, tree;
    }

    function addAll(data) {
      var d, i, n = data.length,
          x,
          y,
          xz = new Array(n),
          yz = new Array(n),
          x0 = Infinity,
          y0 = Infinity,
          x1 = -Infinity,
          y1 = -Infinity;

      // Compute the points and their extent.
      for (i = 0; i < n; ++i) {
        if (isNaN(x = +this._x.call(null, d = data[i])) || isNaN(y = +this._y.call(null, d))) continue;
        xz[i] = x;
        yz[i] = y;
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }

      // If there were no (valid) points, abort.
      if (x0 > x1 || y0 > y1) return this;

      // Expand the tree to cover the new points.
      this.cover(x0, y0).cover(x1, y1);

      // Add the new points.
      for (i = 0; i < n; ++i) {
        add(this, xz[i], yz[i], data[i]);
      }

      return this;
    }

    function tree_cover(x, y) {
      if (isNaN(x = +x) || isNaN(y = +y)) return this; // ignore invalid points

      var x0 = this._x0,
          y0 = this._y0,
          x1 = this._x1,
          y1 = this._y1;

      // If the quadtree has no extent, initialize them.
      // Integer extent are necessary so that if we later double the extent,
      // the existing quadrant boundaries don’t change due to floating point error!
      if (isNaN(x0)) {
        x1 = (x0 = Math.floor(x)) + 1;
        y1 = (y0 = Math.floor(y)) + 1;
      }

      // Otherwise, double repeatedly to cover.
      else {
        var z = x1 - x0 || 1,
            node = this._root,
            parent,
            i;

        while (x0 > x || x >= x1 || y0 > y || y >= y1) {
          i = (y < y0) << 1 | (x < x0);
          parent = new Array(4), parent[i] = node, node = parent, z *= 2;
          switch (i) {
            case 0: x1 = x0 + z, y1 = y0 + z; break;
            case 1: x0 = x1 - z, y1 = y0 + z; break;
            case 2: x1 = x0 + z, y0 = y1 - z; break;
            case 3: x0 = x1 - z, y0 = y1 - z; break;
          }
        }

        if (this._root && this._root.length) this._root = node;
      }

      this._x0 = x0;
      this._y0 = y0;
      this._x1 = x1;
      this._y1 = y1;
      return this;
    }

    function tree_data() {
      var data = [];
      this.visit(function(node) {
        if (!node.length) do data.push(node.data); while (node = node.next)
      });
      return data;
    }

    function tree_extent(_) {
      return arguments.length
          ? this.cover(+_[0][0], +_[0][1]).cover(+_[1][0], +_[1][1])
          : isNaN(this._x0) ? undefined : [[this._x0, this._y0], [this._x1, this._y1]];
    }

    function Quad(node, x0, y0, x1, y1) {
      this.node = node;
      this.x0 = x0;
      this.y0 = y0;
      this.x1 = x1;
      this.y1 = y1;
    }

    function tree_find(x, y, radius) {
      var data,
          x0 = this._x0,
          y0 = this._y0,
          x1,
          y1,
          x2,
          y2,
          x3 = this._x1,
          y3 = this._y1,
          quads = [],
          node = this._root,
          q,
          i;

      if (node) quads.push(new Quad(node, x0, y0, x3, y3));
      if (radius == null) radius = Infinity;
      else {
        x0 = x - radius, y0 = y - radius;
        x3 = x + radius, y3 = y + radius;
        radius *= radius;
      }

      while (q = quads.pop()) {

        // Stop searching if this quadrant can’t contain a closer node.
        if (!(node = q.node)
            || (x1 = q.x0) > x3
            || (y1 = q.y0) > y3
            || (x2 = q.x1) < x0
            || (y2 = q.y1) < y0) continue;

        // Bisect the current quadrant.
        if (node.length) {
          var xm = (x1 + x2) / 2,
              ym = (y1 + y2) / 2;

          quads.push(
            new Quad(node[3], xm, ym, x2, y2),
            new Quad(node[2], x1, ym, xm, y2),
            new Quad(node[1], xm, y1, x2, ym),
            new Quad(node[0], x1, y1, xm, ym)
          );

          // Visit the closest quadrant first.
          if (i = (y >= ym) << 1 | (x >= xm)) {
            q = quads[quads.length - 1];
            quads[quads.length - 1] = quads[quads.length - 1 - i];
            quads[quads.length - 1 - i] = q;
          }
        }

        // Visit this point. (Visiting coincident points isn’t necessary!)
        else {
          var dx = x - +this._x.call(null, node.data),
              dy = y - +this._y.call(null, node.data),
              d2 = dx * dx + dy * dy;
          if (d2 < radius) {
            var d = Math.sqrt(radius = d2);
            x0 = x - d, y0 = y - d;
            x3 = x + d, y3 = y + d;
            data = node.data;
          }
        }
      }

      return data;
    }

    function tree_remove(d) {
      if (isNaN(x = +this._x.call(null, d)) || isNaN(y = +this._y.call(null, d))) return this; // ignore invalid points

      var parent,
          node = this._root,
          retainer,
          previous,
          next,
          x0 = this._x0,
          y0 = this._y0,
          x1 = this._x1,
          y1 = this._y1,
          x,
          y,
          xm,
          ym,
          right,
          bottom,
          i,
          j;

      // If the tree is empty, initialize the root as a leaf.
      if (!node) return this;

      // Find the leaf node for the point.
      // While descending, also retain the deepest parent with a non-removed sibling.
      if (node.length) while (true) {
        if (right = x >= (xm = (x0 + x1) / 2)) x0 = xm; else x1 = xm;
        if (bottom = y >= (ym = (y0 + y1) / 2)) y0 = ym; else y1 = ym;
        if (!(parent = node, node = node[i = bottom << 1 | right])) return this;
        if (!node.length) break;
        if (parent[(i + 1) & 3] || parent[(i + 2) & 3] || parent[(i + 3) & 3]) retainer = parent, j = i;
      }

      // Find the point to remove.
      while (node.data !== d) if (!(previous = node, node = node.next)) return this;
      if (next = node.next) delete node.next;

      // If there are multiple coincident points, remove just the point.
      if (previous) return (next ? previous.next = next : delete previous.next), this;

      // If this is the root point, remove it.
      if (!parent) return this._root = next, this;

      // Remove this leaf.
      next ? parent[i] = next : delete parent[i];

      // If the parent now contains exactly one leaf, collapse superfluous parents.
      if ((node = parent[0] || parent[1] || parent[2] || parent[3])
          && node === (parent[3] || parent[2] || parent[1] || parent[0])
          && !node.length) {
        if (retainer) retainer[j] = node;
        else this._root = node;
      }

      return this;
    }

    function removeAll(data) {
      for (var i = 0, n = data.length; i < n; ++i) this.remove(data[i]);
      return this;
    }

    function tree_root() {
      return this._root;
    }

    function tree_size() {
      var size = 0;
      this.visit(function(node) {
        if (!node.length) do ++size; while (node = node.next)
      });
      return size;
    }

    function tree_visit(callback) {
      var quads = [], q, node = this._root, child, x0, y0, x1, y1;
      if (node) quads.push(new Quad(node, this._x0, this._y0, this._x1, this._y1));
      while (q = quads.pop()) {
        if (!callback(node = q.node, x0 = q.x0, y0 = q.y0, x1 = q.x1, y1 = q.y1) && node.length) {
          var xm = (x0 + x1) / 2, ym = (y0 + y1) / 2;
          if (child = node[3]) quads.push(new Quad(child, xm, ym, x1, y1));
          if (child = node[2]) quads.push(new Quad(child, x0, ym, xm, y1));
          if (child = node[1]) quads.push(new Quad(child, xm, y0, x1, ym));
          if (child = node[0]) quads.push(new Quad(child, x0, y0, xm, ym));
        }
      }
      return this;
    }

    function tree_visitAfter(callback) {
      var quads = [], next = [], q;
      if (this._root) quads.push(new Quad(this._root, this._x0, this._y0, this._x1, this._y1));
      while (q = quads.pop()) {
        var node = q.node;
        if (node.length) {
          var child, x0 = q.x0, y0 = q.y0, x1 = q.x1, y1 = q.y1, xm = (x0 + x1) / 2, ym = (y0 + y1) / 2;
          if (child = node[0]) quads.push(new Quad(child, x0, y0, xm, ym));
          if (child = node[1]) quads.push(new Quad(child, xm, y0, x1, ym));
          if (child = node[2]) quads.push(new Quad(child, x0, ym, xm, y1));
          if (child = node[3]) quads.push(new Quad(child, xm, ym, x1, y1));
        }
        next.push(q);
      }
      while (q = next.pop()) {
        callback(q.node, q.x0, q.y0, q.x1, q.y1);
      }
      return this;
    }

    function defaultX(d) {
      return d[0];
    }

    function tree_x(_) {
      return arguments.length ? (this._x = _, this) : this._x;
    }

    function defaultY(d) {
      return d[1];
    }

    function tree_y(_) {
      return arguments.length ? (this._y = _, this) : this._y;
    }

    function quadtree(nodes, x, y) {
      var tree = new Quadtree(x == null ? defaultX : x, y == null ? defaultY : y, NaN, NaN, NaN, NaN);
      return nodes == null ? tree : tree.addAll(nodes);
    }

    function Quadtree(x, y, x0, y0, x1, y1) {
      this._x = x;
      this._y = y;
      this._x0 = x0;
      this._y0 = y0;
      this._x1 = x1;
      this._y1 = y1;
      this._root = undefined;
    }

    function leaf_copy(leaf) {
      var copy = {data: leaf.data}, next = copy;
      while (leaf = leaf.next) next = next.next = {data: leaf.data};
      return copy;
    }

    var treeProto = quadtree.prototype = Quadtree.prototype;

    treeProto.copy = function() {
      var copy = new Quadtree(this._x, this._y, this._x0, this._y0, this._x1, this._y1),
          node = this._root,
          nodes,
          child;

      if (!node) return copy;

      if (!node.length) return copy._root = leaf_copy(node), copy;

      nodes = [{source: node, target: copy._root = new Array(4)}];
      while (node = nodes.pop()) {
        for (var i = 0; i < 4; ++i) {
          if (child = node.source[i]) {
            if (child.length) nodes.push({source: child, target: node.target[i] = new Array(4)});
            else node.target[i] = leaf_copy(child);
          }
        }
      }

      return copy;
    };

    treeProto.add = tree_add;
    treeProto.addAll = addAll;
    treeProto.cover = tree_cover;
    treeProto.data = tree_data;
    treeProto.extent = tree_extent;
    treeProto.find = tree_find;
    treeProto.remove = tree_remove;
    treeProto.removeAll = removeAll;
    treeProto.root = tree_root;
    treeProto.size = tree_size;
    treeProto.visit = tree_visit;
    treeProto.visitAfter = tree_visitAfter;
    treeProto.x = tree_x;
    treeProto.y = tree_y;

    function constant$1(x) {
      return function() {
        return x;
      };
    }

    function jiggle(random) {
      return (random() - 0.5) * 1e-6;
    }

    function x$2(d) {
      return d.x + d.vx;
    }

    function y$2(d) {
      return d.y + d.vy;
    }

    function forceCollide(radius) {
      var nodes,
          radii,
          random,
          strength = 1,
          iterations = 1;

      if (typeof radius !== "function") radius = constant$1(radius == null ? 1 : +radius);

      function force() {
        var i, n = nodes.length,
            tree,
            node,
            xi,
            yi,
            ri,
            ri2;

        for (var k = 0; k < iterations; ++k) {
          tree = quadtree(nodes, x$2, y$2).visitAfter(prepare);
          for (i = 0; i < n; ++i) {
            node = nodes[i];
            ri = radii[node.index], ri2 = ri * ri;
            xi = node.x + node.vx;
            yi = node.y + node.vy;
            tree.visit(apply);
          }
        }

        function apply(quad, x0, y0, x1, y1) {
          var data = quad.data, rj = quad.r, r = ri + rj;
          if (data) {
            if (data.index > node.index) {
              var x = xi - data.x - data.vx,
                  y = yi - data.y - data.vy,
                  l = x * x + y * y;
              if (l < r * r) {
                if (x === 0) x = jiggle(random), l += x * x;
                if (y === 0) y = jiggle(random), l += y * y;
                l = (r - (l = Math.sqrt(l))) / l * strength;
                node.vx += (x *= l) * (r = (rj *= rj) / (ri2 + rj));
                node.vy += (y *= l) * r;
                data.vx -= x * (r = 1 - r);
                data.vy -= y * r;
              }
            }
            return;
          }
          return x0 > xi + r || x1 < xi - r || y0 > yi + r || y1 < yi - r;
        }
      }

      function prepare(quad) {
        if (quad.data) return quad.r = radii[quad.data.index];
        for (var i = quad.r = 0; i < 4; ++i) {
          if (quad[i] && quad[i].r > quad.r) {
            quad.r = quad[i].r;
          }
        }
      }

      function initialize() {
        if (!nodes) return;
        var i, n = nodes.length, node;
        radii = new Array(n);
        for (i = 0; i < n; ++i) node = nodes[i], radii[node.index] = +radius(node, i, nodes);
      }

      force.initialize = function(_nodes, _random) {
        nodes = _nodes;
        random = _random;
        initialize();
      };

      force.iterations = function(_) {
        return arguments.length ? (iterations = +_, force) : iterations;
      };

      force.strength = function(_) {
        return arguments.length ? (strength = +_, force) : strength;
      };

      force.radius = function(_) {
        return arguments.length ? (radius = typeof _ === "function" ? _ : constant$1(+_), initialize(), force) : radius;
      };

      return force;
    }

    var noop = {value: () => {}};

    function dispatch() {
      for (var i = 0, n = arguments.length, _ = {}, t; i < n; ++i) {
        if (!(t = arguments[i] + "") || (t in _) || /[\s.]/.test(t)) throw new Error("illegal type: " + t);
        _[t] = [];
      }
      return new Dispatch(_);
    }

    function Dispatch(_) {
      this._ = _;
    }

    function parseTypenames(typenames, types) {
      return typenames.trim().split(/^|\s+/).map(function(t) {
        var name = "", i = t.indexOf(".");
        if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
        if (t && !types.hasOwnProperty(t)) throw new Error("unknown type: " + t);
        return {type: t, name: name};
      });
    }

    Dispatch.prototype = dispatch.prototype = {
      constructor: Dispatch,
      on: function(typename, callback) {
        var _ = this._,
            T = parseTypenames(typename + "", _),
            t,
            i = -1,
            n = T.length;

        // If no callback was specified, return the callback of the given type and name.
        if (arguments.length < 2) {
          while (++i < n) if ((t = (typename = T[i]).type) && (t = get(_[t], typename.name))) return t;
          return;
        }

        // If a type was specified, set the callback for the given type and name.
        // Otherwise, if a null callback was specified, remove callbacks of the given name.
        if (callback != null && typeof callback !== "function") throw new Error("invalid callback: " + callback);
        while (++i < n) {
          if (t = (typename = T[i]).type) _[t] = set(_[t], typename.name, callback);
          else if (callback == null) for (t in _) _[t] = set(_[t], typename.name, null);
        }

        return this;
      },
      copy: function() {
        var copy = {}, _ = this._;
        for (var t in _) copy[t] = _[t].slice();
        return new Dispatch(copy);
      },
      call: function(type, that) {
        if ((n = arguments.length - 2) > 0) for (var args = new Array(n), i = 0, n, t; i < n; ++i) args[i] = arguments[i + 2];
        if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
        for (t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
      },
      apply: function(type, that, args) {
        if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
        for (var t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
      }
    };

    function get(type, name) {
      for (var i = 0, n = type.length, c; i < n; ++i) {
        if ((c = type[i]).name === name) {
          return c.value;
        }
      }
    }

    function set(type, name, callback) {
      for (var i = 0, n = type.length; i < n; ++i) {
        if (type[i].name === name) {
          type[i] = noop, type = type.slice(0, i).concat(type.slice(i + 1));
          break;
        }
      }
      if (callback != null) type.push({name: name, value: callback});
      return type;
    }

    var frame = 0, // is an animation frame pending?
        timeout = 0, // is a timeout pending?
        interval = 0, // are any timers active?
        pokeDelay = 1000, // how frequently we check for clock skew
        taskHead,
        taskTail,
        clockLast = 0,
        clockNow = 0,
        clockSkew = 0,
        clock = typeof performance === "object" && performance.now ? performance : Date,
        setFrame = typeof window === "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(f) { setTimeout(f, 17); };

    function now() {
      return clockNow || (setFrame(clearNow), clockNow = clock.now() + clockSkew);
    }

    function clearNow() {
      clockNow = 0;
    }

    function Timer() {
      this._call =
      this._time =
      this._next = null;
    }

    Timer.prototype = timer.prototype = {
      constructor: Timer,
      restart: function(callback, delay, time) {
        if (typeof callback !== "function") throw new TypeError("callback is not a function");
        time = (time == null ? now() : +time) + (delay == null ? 0 : +delay);
        if (!this._next && taskTail !== this) {
          if (taskTail) taskTail._next = this;
          else taskHead = this;
          taskTail = this;
        }
        this._call = callback;
        this._time = time;
        sleep();
      },
      stop: function() {
        if (this._call) {
          this._call = null;
          this._time = Infinity;
          sleep();
        }
      }
    };

    function timer(callback, delay, time) {
      var t = new Timer;
      t.restart(callback, delay, time);
      return t;
    }

    function timerFlush() {
      now(); // Get the current time, if not already set.
      ++frame; // Pretend we’ve set an alarm, if we haven’t already.
      var t = taskHead, e;
      while (t) {
        if ((e = clockNow - t._time) >= 0) t._call.call(undefined, e);
        t = t._next;
      }
      --frame;
    }

    function wake() {
      clockNow = (clockLast = clock.now()) + clockSkew;
      frame = timeout = 0;
      try {
        timerFlush();
      } finally {
        frame = 0;
        nap();
        clockNow = 0;
      }
    }

    function poke() {
      var now = clock.now(), delay = now - clockLast;
      if (delay > pokeDelay) clockSkew -= delay, clockLast = now;
    }

    function nap() {
      var t0, t1 = taskHead, t2, time = Infinity;
      while (t1) {
        if (t1._call) {
          if (time > t1._time) time = t1._time;
          t0 = t1, t1 = t1._next;
        } else {
          t2 = t1._next, t1._next = null;
          t1 = t0 ? t0._next = t2 : taskHead = t2;
        }
      }
      taskTail = t0;
      sleep(time);
    }

    function sleep(time) {
      if (frame) return; // Soonest alarm already set, or will be.
      if (timeout) timeout = clearTimeout(timeout);
      var delay = time - clockNow; // Strictly less than if we recomputed clockNow.
      if (delay > 24) {
        if (time < Infinity) timeout = setTimeout(wake, time - clock.now() - clockSkew);
        if (interval) interval = clearInterval(interval);
      } else {
        if (!interval) clockLast = clock.now(), interval = setInterval(poke, pokeDelay);
        frame = 1, setFrame(wake);
      }
    }

    // https://en.wikipedia.org/wiki/Linear_congruential_generator#Parameters_in_common_use
    const a = 1664525;
    const c = 1013904223;
    const m = 4294967296; // 2^32

    function lcg() {
      let s = 1;
      return () => (s = (a * s + c) % m) / m;
    }

    function x$1(d) {
      return d.x;
    }

    function y$1(d) {
      return d.y;
    }

    var initialRadius = 10,
        initialAngle = Math.PI * (3 - Math.sqrt(5));

    function forceSimulation(nodes) {
      var simulation,
          alpha = 1,
          alphaMin = 0.001,
          alphaDecay = 1 - Math.pow(alphaMin, 1 / 300),
          alphaTarget = 0,
          velocityDecay = 0.6,
          forces = new Map(),
          stepper = timer(step),
          event = dispatch("tick", "end"),
          random = lcg();

      if (nodes == null) nodes = [];

      function step() {
        tick();
        event.call("tick", simulation);
        if (alpha < alphaMin) {
          stepper.stop();
          event.call("end", simulation);
        }
      }

      function tick(iterations) {
        var i, n = nodes.length, node;

        if (iterations === undefined) iterations = 1;

        for (var k = 0; k < iterations; ++k) {
          alpha += (alphaTarget - alpha) * alphaDecay;

          forces.forEach(function(force) {
            force(alpha);
          });

          for (i = 0; i < n; ++i) {
            node = nodes[i];
            if (node.fx == null) node.x += node.vx *= velocityDecay;
            else node.x = node.fx, node.vx = 0;
            if (node.fy == null) node.y += node.vy *= velocityDecay;
            else node.y = node.fy, node.vy = 0;
          }
        }

        return simulation;
      }

      function initializeNodes() {
        for (var i = 0, n = nodes.length, node; i < n; ++i) {
          node = nodes[i], node.index = i;
          if (node.fx != null) node.x = node.fx;
          if (node.fy != null) node.y = node.fy;
          if (isNaN(node.x) || isNaN(node.y)) {
            var radius = initialRadius * Math.sqrt(0.5 + i), angle = i * initialAngle;
            node.x = radius * Math.cos(angle);
            node.y = radius * Math.sin(angle);
          }
          if (isNaN(node.vx) || isNaN(node.vy)) {
            node.vx = node.vy = 0;
          }
        }
      }

      function initializeForce(force) {
        if (force.initialize) force.initialize(nodes, random);
        return force;
      }

      initializeNodes();

      return simulation = {
        tick: tick,

        restart: function() {
          return stepper.restart(step), simulation;
        },

        stop: function() {
          return stepper.stop(), simulation;
        },

        nodes: function(_) {
          return arguments.length ? (nodes = _, initializeNodes(), forces.forEach(initializeForce), simulation) : nodes;
        },

        alpha: function(_) {
          return arguments.length ? (alpha = +_, simulation) : alpha;
        },

        alphaMin: function(_) {
          return arguments.length ? (alphaMin = +_, simulation) : alphaMin;
        },

        alphaDecay: function(_) {
          return arguments.length ? (alphaDecay = +_, simulation) : +alphaDecay;
        },

        alphaTarget: function(_) {
          return arguments.length ? (alphaTarget = +_, simulation) : alphaTarget;
        },

        velocityDecay: function(_) {
          return arguments.length ? (velocityDecay = 1 - _, simulation) : 1 - velocityDecay;
        },

        randomSource: function(_) {
          return arguments.length ? (random = _, forces.forEach(initializeForce), simulation) : random;
        },

        force: function(name, _) {
          return arguments.length > 1 ? ((_ == null ? forces.delete(name) : forces.set(name, initializeForce(_))), simulation) : forces.get(name);
        },

        find: function(x, y, radius) {
          var i = 0,
              n = nodes.length,
              dx,
              dy,
              d2,
              node,
              closest;

          if (radius == null) radius = Infinity;
          else radius *= radius;

          for (i = 0; i < n; ++i) {
            node = nodes[i];
            dx = x - node.x;
            dy = y - node.y;
            d2 = dx * dx + dy * dy;
            if (d2 < radius) closest = node, radius = d2;
          }

          return closest;
        },

        on: function(name, _) {
          return arguments.length > 1 ? (event.on(name, _), simulation) : event.on(name);
        }
      };
    }

    function forceManyBody() {
      var nodes,
          node,
          random,
          alpha,
          strength = constant$1(-30),
          strengths,
          distanceMin2 = 1,
          distanceMax2 = Infinity,
          theta2 = 0.81;

      function force(_) {
        var i, n = nodes.length, tree = quadtree(nodes, x$1, y$1).visitAfter(accumulate);
        for (alpha = _, i = 0; i < n; ++i) node = nodes[i], tree.visit(apply);
      }

      function initialize() {
        if (!nodes) return;
        var i, n = nodes.length, node;
        strengths = new Array(n);
        for (i = 0; i < n; ++i) node = nodes[i], strengths[node.index] = +strength(node, i, nodes);
      }

      function accumulate(quad) {
        var strength = 0, q, c, weight = 0, x, y, i;

        // For internal nodes, accumulate forces from child quadrants.
        if (quad.length) {
          for (x = y = i = 0; i < 4; ++i) {
            if ((q = quad[i]) && (c = Math.abs(q.value))) {
              strength += q.value, weight += c, x += c * q.x, y += c * q.y;
            }
          }
          quad.x = x / weight;
          quad.y = y / weight;
        }

        // For leaf nodes, accumulate forces from coincident quadrants.
        else {
          q = quad;
          q.x = q.data.x;
          q.y = q.data.y;
          do strength += strengths[q.data.index];
          while (q = q.next);
        }

        quad.value = strength;
      }

      function apply(quad, x1, _, x2) {
        if (!quad.value) return true;

        var x = quad.x - node.x,
            y = quad.y - node.y,
            w = x2 - x1,
            l = x * x + y * y;

        // Apply the Barnes-Hut approximation if possible.
        // Limit forces for very close nodes; randomize direction if coincident.
        if (w * w / theta2 < l) {
          if (l < distanceMax2) {
            if (x === 0) x = jiggle(random), l += x * x;
            if (y === 0) y = jiggle(random), l += y * y;
            if (l < distanceMin2) l = Math.sqrt(distanceMin2 * l);
            node.vx += x * quad.value * alpha / l;
            node.vy += y * quad.value * alpha / l;
          }
          return true;
        }

        // Otherwise, process points directly.
        else if (quad.length || l >= distanceMax2) return;

        // Limit forces for very close nodes; randomize direction if coincident.
        if (quad.data !== node || quad.next) {
          if (x === 0) x = jiggle(random), l += x * x;
          if (y === 0) y = jiggle(random), l += y * y;
          if (l < distanceMin2) l = Math.sqrt(distanceMin2 * l);
        }

        do if (quad.data !== node) {
          w = strengths[quad.data.index] * alpha / l;
          node.vx += x * w;
          node.vy += y * w;
        } while (quad = quad.next);
      }

      force.initialize = function(_nodes, _random) {
        nodes = _nodes;
        random = _random;
        initialize();
      };

      force.strength = function(_) {
        return arguments.length ? (strength = typeof _ === "function" ? _ : constant$1(+_), initialize(), force) : strength;
      };

      force.distanceMin = function(_) {
        return arguments.length ? (distanceMin2 = _ * _, force) : Math.sqrt(distanceMin2);
      };

      force.distanceMax = function(_) {
        return arguments.length ? (distanceMax2 = _ * _, force) : Math.sqrt(distanceMax2);
      };

      force.theta = function(_) {
        return arguments.length ? (theta2 = _ * _, force) : Math.sqrt(theta2);
      };

      return force;
    }

    function forceX(x) {
      var strength = constant$1(0.1),
          nodes,
          strengths,
          xz;

      if (typeof x !== "function") x = constant$1(x == null ? 0 : +x);

      function force(alpha) {
        for (var i = 0, n = nodes.length, node; i < n; ++i) {
          node = nodes[i], node.vx += (xz[i] - node.x) * strengths[i] * alpha;
        }
      }

      function initialize() {
        if (!nodes) return;
        var i, n = nodes.length;
        strengths = new Array(n);
        xz = new Array(n);
        for (i = 0; i < n; ++i) {
          strengths[i] = isNaN(xz[i] = +x(nodes[i], i, nodes)) ? 0 : +strength(nodes[i], i, nodes);
        }
      }

      force.initialize = function(_) {
        nodes = _;
        initialize();
      };

      force.strength = function(_) {
        return arguments.length ? (strength = typeof _ === "function" ? _ : constant$1(+_), initialize(), force) : strength;
      };

      force.x = function(_) {
        return arguments.length ? (x = typeof _ === "function" ? _ : constant$1(+_), initialize(), force) : x;
      };

      return force;
    }

    function forceY(y) {
      var strength = constant$1(0.1),
          nodes,
          strengths,
          yz;

      if (typeof y !== "function") y = constant$1(y == null ? 0 : +y);

      function force(alpha) {
        for (var i = 0, n = nodes.length, node; i < n; ++i) {
          node = nodes[i], node.vy += (yz[i] - node.y) * strengths[i] * alpha;
        }
      }

      function initialize() {
        if (!nodes) return;
        var i, n = nodes.length;
        strengths = new Array(n);
        yz = new Array(n);
        for (i = 0; i < n; ++i) {
          strengths[i] = isNaN(yz[i] = +y(nodes[i], i, nodes)) ? 0 : +strength(nodes[i], i, nodes);
        }
      }

      force.initialize = function(_) {
        nodes = _;
        initialize();
      };

      force.strength = function(_) {
        return arguments.length ? (strength = typeof _ === "function" ? _ : constant$1(+_), initialize(), force) : strength;
      };

      force.y = function(_) {
        return arguments.length ? (y = typeof _ === "function" ? _ : constant$1(+_), initialize(), force) : y;
      };

      return force;
    }

    /* src/components/graphs/Force.svelte generated by Svelte v3.49.0 */

    const file$u = "src/components/graphs/Force.svelte";

    function get_each_context$l(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[26] = list[i];
    	return child_ctx;
    }

    // (76:2) {#each nodes as node}
    function create_each_block$l(ctx) {
    	let circle;
    	let circle_fill_value;
    	let circle_cx_value;
    	let circle_cy_value;
    	let circle_r_value;
    	let mounted;
    	let dispose;

    	function mouseover_handler(...args) {
    		return /*mouseover_handler*/ ctx[19](/*node*/ ctx[26], ...args);
    	}

    	function focus_handler(...args) {
    		return /*focus_handler*/ ctx[20](/*node*/ ctx[26], ...args);
    	}

    	const block = {
    		c: function create() {
    			circle = svg_element("circle");
    			attr_dev(circle, "class", "node");
    			attr_dev(circle, "fill", circle_fill_value = /*$zGet*/ ctx[4](/*node*/ ctx[26]));
    			attr_dev(circle, "stroke", /*stroke*/ ctx[1]);
    			attr_dev(circle, "stroke-width", /*strokeWidth*/ ctx[0]);
    			attr_dev(circle, "cx", circle_cx_value = /*node*/ ctx[26].x);
    			attr_dev(circle, "cy", circle_cy_value = /*node*/ ctx[26].y);
    			attr_dev(circle, "r", circle_r_value = /*$rGet*/ ctx[2](/*node*/ ctx[26]));
    			add_location(circle, file$u, 76, 4, 2452);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, circle, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(circle, "mouseover", mouseover_handler, false, false, false),
    					listen_dev(circle, "focus", focus_handler, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*$zGet, nodes*/ 24 && circle_fill_value !== (circle_fill_value = /*$zGet*/ ctx[4](/*node*/ ctx[26]))) {
    				attr_dev(circle, "fill", circle_fill_value);
    			}

    			if (dirty & /*stroke*/ 2) {
    				attr_dev(circle, "stroke", /*stroke*/ ctx[1]);
    			}

    			if (dirty & /*strokeWidth*/ 1) {
    				attr_dev(circle, "stroke-width", /*strokeWidth*/ ctx[0]);
    			}

    			if (dirty & /*nodes*/ 8 && circle_cx_value !== (circle_cx_value = /*node*/ ctx[26].x)) {
    				attr_dev(circle, "cx", circle_cx_value);
    			}

    			if (dirty & /*nodes*/ 8 && circle_cy_value !== (circle_cy_value = /*node*/ ctx[26].y)) {
    				attr_dev(circle, "cy", circle_cy_value);
    			}

    			if (dirty & /*$rGet, nodes*/ 12 && circle_r_value !== (circle_r_value = /*$rGet*/ ctx[2](/*node*/ ctx[26]))) {
    				attr_dev(circle, "r", circle_r_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(circle);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$l.name,
    		type: "each",
    		source: "(76:2) {#each nodes as node}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$v(ctx) {
    	let g;
    	let mounted;
    	let dispose;
    	let each_value = /*nodes*/ ctx[3];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$l(get_each_context$l(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			g = svg_element("g");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(g, "class", "bee-group");
    			add_location(g, file$u, 70, 0, 2320);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, g, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(g, null);
    			}

    			if (!mounted) {
    				dispose = [
    					listen_dev(g, "mouseout", /*mouseout_handler*/ ctx[21], false, false, false),
    					listen_dev(g, "blur", /*blur_handler*/ ctx[22], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$zGet, nodes, stroke, strokeWidth, $rGet, handleMouseOver*/ 1055) {
    				each_value = /*nodes*/ ctx[3];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$l(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$l(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(g, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(g);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$v.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$v($$self, $$props, $$invalidate) {
    	let $height;
    	let $xGet;
    	let $rGet;
    	let $data;
    	let $zGet;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Force', slots, []);
    	const { data, xGet, zGet, rGet, height, width } = getContext('LayerCake');
    	validate_store(data, 'data');
    	component_subscribe($$self, data, value => $$invalidate(23, $data = value));
    	validate_store(xGet, 'xGet');
    	component_subscribe($$self, xGet, value => $$invalidate(18, $xGet = value));
    	validate_store(zGet, 'zGet');
    	component_subscribe($$self, zGet, value => $$invalidate(4, $zGet = value));
    	validate_store(rGet, 'rGet');
    	component_subscribe($$self, rGet, value => $$invalidate(2, $rGet = value));
    	validate_store(height, 'height');
    	component_subscribe($$self, height, value => $$invalidate(17, $height = value));
    	let { strokeWidth = 1 } = $$props;
    	let { stroke = '#fff' } = $$props;
    	let { xStrength = 0.95 } = $$props;
    	let { yStrength = 0.075 } = $$props;
    	let { collideStrength = 0.075 } = $$props;
    	let { currentStep } = $$props;

    	// /** @type {Function} [getTitle] — An accessor function to get the field on the data element to display as a hover label using a `<title>` tag. */
    	// export let getTitle = undefined;
    	const dispatch = createEventDispatcher();

    	let nodes = $data.map((d, i) => {
    		return {
    			...d,
    			y: 500 / 2,
    			x: i / $data.length * 960
    		};
    	});

    	let simulation = forceSimulation(nodes);

    	// console.log(simulation.nodes())
    	simulation.on("tick", () => {
    		$$invalidate(3, nodes = simulation.nodes());
    	});

    	function handleMouseOver(e, d) {
    		if (currentStep === 3) {
    			const { target } = e;
    			dispatch('mousemove', { e, props: d });
    			target.classList.add('active-node');
    		}
    	}

    	function handleMouseOut(e) {
    		if (currentStep === 3) {
    			const { target } = e;
    			dispatch('mouseout');
    			target.classList.remove('active-node');
    		}
    	}

    	const writable_props = [
    		'strokeWidth',
    		'stroke',
    		'xStrength',
    		'yStrength',
    		'collideStrength',
    		'currentStep'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Force> was created with unknown prop '${key}'`);
    	});

    	const mouseover_handler = (node, e) => handleMouseOver(e, node);
    	const focus_handler = (node, e) => handleMouseOver(e, node);
    	const mouseout_handler = e => handleMouseOut(e);
    	const blur_handler = e => handleMouseOut(e);

    	$$self.$$set = $$props => {
    		if ('strokeWidth' in $$props) $$invalidate(0, strokeWidth = $$props.strokeWidth);
    		if ('stroke' in $$props) $$invalidate(1, stroke = $$props.stroke);
    		if ('xStrength' in $$props) $$invalidate(12, xStrength = $$props.xStrength);
    		if ('yStrength' in $$props) $$invalidate(13, yStrength = $$props.yStrength);
    		if ('collideStrength' in $$props) $$invalidate(14, collideStrength = $$props.collideStrength);
    		if ('currentStep' in $$props) $$invalidate(15, currentStep = $$props.currentStep);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		createEventDispatcher,
    		forceSimulation,
    		forceX,
    		forceY,
    		forceCollide,
    		forceManyBody,
    		data,
    		xGet,
    		zGet,
    		rGet,
    		height,
    		width,
    		strokeWidth,
    		stroke,
    		xStrength,
    		yStrength,
    		collideStrength,
    		currentStep,
    		dispatch,
    		nodes,
    		simulation,
    		handleMouseOver,
    		handleMouseOut,
    		$height,
    		$xGet,
    		$rGet,
    		$data,
    		$zGet
    	});

    	$$self.$inject_state = $$props => {
    		if ('strokeWidth' in $$props) $$invalidate(0, strokeWidth = $$props.strokeWidth);
    		if ('stroke' in $$props) $$invalidate(1, stroke = $$props.stroke);
    		if ('xStrength' in $$props) $$invalidate(12, xStrength = $$props.xStrength);
    		if ('yStrength' in $$props) $$invalidate(13, yStrength = $$props.yStrength);
    		if ('collideStrength' in $$props) $$invalidate(14, collideStrength = $$props.collideStrength);
    		if ('currentStep' in $$props) $$invalidate(15, currentStep = $$props.currentStep);
    		if ('nodes' in $$props) $$invalidate(3, nodes = $$props.nodes);
    		if ('simulation' in $$props) $$invalidate(16, simulation = $$props.simulation);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*simulation, $rGet, collideStrength, $xGet, xStrength, $height, yStrength*/ 487428) {
    			{
    				$$invalidate(16, simulation = simulation.force('collide', forceCollide(d => $rGet(d) + 0.5).strength(collideStrength).iterations(2)).force('x', forceX().x(d => $xGet(d)).strength(xStrength)).force('y', forceY().y($height / 2).strength(yStrength)).force('charge', forceManyBody().strength(-1)).alpha(1).restart());
    			}
    		}
    	};

    	return [
    		strokeWidth,
    		stroke,
    		$rGet,
    		nodes,
    		$zGet,
    		data,
    		xGet,
    		zGet,
    		rGet,
    		height,
    		handleMouseOver,
    		handleMouseOut,
    		xStrength,
    		yStrength,
    		collideStrength,
    		currentStep,
    		simulation,
    		$height,
    		$xGet,
    		mouseover_handler,
    		focus_handler,
    		mouseout_handler,
    		blur_handler
    	];
    }

    class Force extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$v, create_fragment$v, safe_not_equal, {
    			strokeWidth: 0,
    			stroke: 1,
    			xStrength: 12,
    			yStrength: 13,
    			collideStrength: 14,
    			currentStep: 15
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Force",
    			options,
    			id: create_fragment$v.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*currentStep*/ ctx[15] === undefined && !('currentStep' in props)) {
    			console.warn("<Force> was created without expected prop 'currentStep'");
    		}
    	}

    	get strokeWidth() {
    		throw new Error("<Force>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set strokeWidth(value) {
    		throw new Error("<Force>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get stroke() {
    		throw new Error("<Force>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set stroke(value) {
    		throw new Error("<Force>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xStrength() {
    		throw new Error("<Force>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xStrength(value) {
    		throw new Error("<Force>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get yStrength() {
    		throw new Error("<Force>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set yStrength(value) {
    		throw new Error("<Force>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get collideStrength() {
    		throw new Error("<Force>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set collideStrength(value) {
    		throw new Error("<Force>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get currentStep() {
    		throw new Error("<Force>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set currentStep(value) {
    		throw new Error("<Force>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const labelMap = new Map([
        ['fL', "Far Left"],
        ['L', "Left"],
        ['C', "Center"],
        ['AW', "Anti-woke"],
        ['R', "Right"],
        ["fR", "Far Right"]
    ]);
    const youTubeMap$1 = new Map([
        ['Ext URL', "External URL"],
        ['HP', "Homepage"],
        ['Other', "Other"],
        ['Search', "Search"],
        ['User/Channel', "User or Channel"],
        ["Video", "Video"]
    ]);

    const colorMap = new Map([
        ['fL', "#336084"],
        ['L', "#98BBD7"],
        ['C', "#A9A9A9"],
        ['AW', "#C19AC1"],
        ['R', "#CF6363"],
        ["fR", "#AC3535"],
    ]);
    const youTubeMap = new Map([
        ["Ext URL", "#FFA10A"],
        ["HP", "#FFE0AD"],
        ["Other", "#FFD085"],
        ["Search", "#FFC05C"],
        ["User/Channel", "#FFB133"],
        ["Video", "#E08A00"]
    ]);

    /* src/components/graphs/atoms/Labels.svelte generated by Svelte v3.49.0 */
    const file$t = "src/components/graphs/atoms/Labels.svelte";

    function get_each_context$k(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	return child_ctx;
    }

    // (8:4) {#each $zDomain as group}
    function create_each_block$k(ctx) {
    	let div;
    	let span;
    	let t0_value = labelMap.get(/*group*/ ctx[5]) + "";
    	let t0;
    	let span_style_value;
    	let t1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			span = element("span");
    			t0 = text$1(t0_value);
    			t1 = space();
    			attr_dev(span, "class", "label svelte-ggv53i");
    			attr_dev(span, "style", span_style_value = `--left: ${/*$xScale*/ ctx[1](/*group*/ ctx[5])}px; --color: ${colorMap.get(/*group*/ ctx[5])}`);
    			add_location(span, file$t, 10, 12, 451);
    			attr_dev(div, "class", "label-group");
    			add_location(div, file$t, 9, 8, 413);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span);
    			append_dev(span, t0);
    			append_dev(div, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$zDomain*/ 1 && t0_value !== (t0_value = labelMap.get(/*group*/ ctx[5]) + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*$xScale, $zDomain*/ 3 && span_style_value !== (span_style_value = `--left: ${/*$xScale*/ ctx[1](/*group*/ ctx[5])}px; --color: ${colorMap.get(/*group*/ ctx[5])}`)) {
    				attr_dev(span, "style", span_style_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$k.name,
    		type: "each",
    		source: "(8:4) {#each $zDomain as group}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$u(ctx) {
    	let div;
    	let each_value = /*$zDomain*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$k(get_each_context$k(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "label-container svelte-ggv53i");
    			add_location(div, file$t, 6, 0, 219);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$xScale, $zDomain, colorMap, labelMap*/ 3) {
    				each_value = /*$zDomain*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$k(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$k(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$u.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$u($$self, $$props, $$invalidate) {
    	let $zDomain;
    	let $xScale;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Labels', slots, []);
    	const { xScale, zDomain, zScale } = getContext('LayerCake');
    	validate_store(xScale, 'xScale');
    	component_subscribe($$self, xScale, value => $$invalidate(1, $xScale = value));
    	validate_store(zDomain, 'zDomain');
    	component_subscribe($$self, zDomain, value => $$invalidate(0, $zDomain = value));
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Labels> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		getContext,
    		labelMap,
    		colorMap,
    		xScale,
    		zDomain,
    		zScale,
    		$zDomain,
    		$xScale
    	});

    	return [$zDomain, $xScale, xScale, zDomain];
    }

    class Labels extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$u, create_fragment$u, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Labels",
    			options,
    			id: create_fragment$u.name
    		});
    	}
    }

    /* src/components/graphs/tooltips/Tooltip.svelte generated by Svelte v3.49.0 */

    const file$s = "src/components/graphs/tooltips/Tooltip.svelte";
    const get_default_slot_changes$1 = dirty => ({ detail: dirty & /*evt*/ 1 });
    const get_default_slot_context$1 = ctx => ({ detail: /*evt*/ ctx[0].detail });

    // (26:2) {#if evt.detail}
    function create_if_block$j(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], get_default_slot_context$1);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "tooltip svelte-3ysjn7");
    			set_style(div, "top", /*evt*/ ctx[0].detail.e.layerY + /*offset*/ ctx[1] + "px");
    			set_style(div, "left", /*evt*/ ctx[0].detail.e.layerX + "px");
    			add_location(div, file$s, 26, 4, 862);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, evt*/ 5)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, get_default_slot_changes$1),
    						get_default_slot_context$1
    					);
    				}
    			}

    			if (!current || dirty & /*evt, offset*/ 3) {
    				set_style(div, "top", /*evt*/ ctx[0].detail.e.layerY + /*offset*/ ctx[1] + "px");
    			}

    			if (!current || dirty & /*evt*/ 1) {
    				set_style(div, "left", /*evt*/ ctx[0].detail.e.layerX + "px");
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$j.name,
    		type: "if",
    		source: "(26:2) {#if evt.detail}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$t(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*evt*/ ctx[0].detail && create_if_block$j(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*evt*/ ctx[0].detail) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*evt*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$j(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$t.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$t($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Tooltip', slots, ['default']);
    	let { evt = {} } = $$props;
    	let { offset = -35 } = $$props;
    	const writable_props = ['evt', 'offset'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Tooltip> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('evt' in $$props) $$invalidate(0, evt = $$props.evt);
    		if ('offset' in $$props) $$invalidate(1, offset = $$props.offset);
    		if ('$$scope' in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ evt, offset });

    	$$self.$inject_state = $$props => {
    		if ('evt' in $$props) $$invalidate(0, evt = $$props.evt);
    		if ('offset' in $$props) $$invalidate(1, offset = $$props.offset);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [evt, offset, $$scope, slots];
    }

    class Tooltip extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$t, create_fragment$t, safe_not_equal, { evt: 0, offset: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tooltip",
    			options,
    			id: create_fragment$t.name
    		});
    	}

    	get evt() {
    		throw new Error("<Tooltip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set evt(value) {
    		throw new Error("<Tooltip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get offset() {
    		throw new Error("<Tooltip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set offset(value) {
    		throw new Error("<Tooltip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/graphs/Beeswarm.svelte generated by Svelte v3.49.0 */
    const file$r = "src/components/graphs/Beeswarm.svelte";

    function get_context$4(ctx) {
    	const constants_0 = { .../*detail*/ ctx[15].props };
    	ctx[16] = constants_0;
    }

    function get_each_context$j(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[17] = list[i];
    	const constants_0 = /*key*/ child_ctx[17].replace(/^\w/, d => d.toUpperCase()).replace('_', ' ');
    	child_ctx[18] = constants_0;
    	const constants_1 = /*tooltipData*/ child_ctx[16][/*key*/ child_ctx[17]];
    	child_ctx[19] = constants_1;
    	return child_ctx;
    }

    // (38:4) <Svg>
    function create_default_slot_3$3(ctx) {
    	let force;
    	let current;

    	force = new Force({
    			props: {
    				strokeWidth: 0,
    				xStrength: 0.1,
    				yStrength: 0.05,
    				collideStrength: 1,
    				currentStep: /*currentStep*/ ctx[1]
    			},
    			$$inline: true
    		});

    	force.$on("mousemove", /*mousemove_handler*/ ctx[13]);
    	force.$on("mouseout", /*mouseout_handler*/ ctx[14]);

    	const block = {
    		c: function create() {
    			create_component(force.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(force, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const force_changes = {};
    			if (dirty & /*currentStep*/ 2) force_changes.currentStep = /*currentStep*/ ctx[1];
    			force.$set(force_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(force.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(force.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(force, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$3.name,
    		type: "slot",
    		source: "(38:4) <Svg>",
    		ctx
    	});

    	return block;
    }

    // (52:2) {#if currentStep === 2}
    function create_if_block_2$2(ctx) {
    	let labels;
    	let current;
    	labels = new Labels({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(labels.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(labels, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(labels.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(labels.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(labels, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(52:2) {#if currentStep === 2}",
    		ctx
    	});

    	return block;
    }

    // (56:2) {#if hideTooltip !== true && currentStep === 3}
    function create_if_block$i(ctx) {
    	let tooltip;
    	let current;

    	tooltip = new Tooltip({
    			props: {
    				evt: /*evt*/ ctx[11],
    				$$slots: {
    					default: [
    						create_default_slot_2$5,
    						({ detail }) => ({ 15: detail }),
    						({ detail }) => detail ? 32768 : 0
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(tooltip.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(tooltip, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const tooltip_changes = {};
    			if (dirty & /*evt*/ 2048) tooltip_changes.evt = /*evt*/ ctx[11];

    			if (dirty & /*$$scope, detail*/ 4227072) {
    				tooltip_changes.$$scope = { dirty, ctx };
    			}

    			tooltip.$set(tooltip_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tooltip.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tooltip.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tooltip, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$i.name,
    		type: "if",
    		source: "(56:2) {#if hideTooltip !== true && currentStep === 3}",
    		ctx
    	});

    	return block;
    }

    // (70:5) {#if value}
    function create_if_block_1$8(ctx) {
    	let div;
    	let span;
    	let t0;
    	let t1;
    	let t2;
    	let t3_value = /*value*/ ctx[19].toLocaleString() + "";
    	let t3;

    	const block = {
    		c: function create() {
    			div = element("div");
    			span = element("span");
    			t0 = text$1(/*keyCapitalized*/ ctx[18]);
    			t1 = text$1(":");
    			t2 = space();
    			t3 = text$1(t3_value);
    			add_location(span, file$r, 70, 23, 1871);
    			attr_dev(div, "class", "row");
    			add_location(div, file$r, 70, 6, 1854);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span);
    			append_dev(span, t0);
    			append_dev(span, t1);
    			append_dev(div, t2);
    			append_dev(div, t3);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*detail*/ 32768 && t3_value !== (t3_value = /*value*/ ctx[19].toLocaleString() + "")) set_data_dev(t3, t3_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$8.name,
    		type: "if",
    		source: "(70:5) {#if value}",
    		ctx
    	});

    	return block;
    }

    // (67:4) {#each ['total_videos', 'subscribers'] as key}
    function create_each_block$j(ctx) {
    	let if_block_anchor;
    	let if_block = /*value*/ ctx[19] && create_if_block_1$8(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*value*/ ctx[19]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1$8(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$j.name,
    		type: "each",
    		source: "(67:4) {#each ['total_videos', 'subscribers'] as key}",
    		ctx
    	});

    	return block;
    }

    // (57:3) <Tooltip     {evt}     let:detail    >
    function create_default_slot_2$5(ctx) {
    	get_context$4(ctx);
    	let div0;
    	let t0_value = /*tooltipData*/ ctx[16].channel_name + "";
    	let t0;
    	let t1;
    	let div1;
    	let t2_value = labelMap.get(/*tooltipData*/ ctx[16].cluster) + "";
    	let t2;
    	let t3;
    	let each_1_anchor;
    	let each_value = ['total_videos', 'subscribers'];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < 2; i += 1) {
    		each_blocks[i] = create_each_block$j(get_each_context$j(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t0 = text$1(t0_value);
    			t1 = space();
    			div1 = element("div");
    			t2 = text$1(t2_value);
    			t3 = space();

    			for (let i = 0; i < 2; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    			attr_dev(div0, "class", "channel-label svelte-szz4gu");
    			add_location(div0, file$r, 61, 4, 1450);
    			attr_dev(div1, "class", "cluster-label svelte-szz4gu");
    			set_style(div1, "--color", colorMap.get(/*tooltipData*/ ctx[16].cluster));
    			add_location(div1, file$r, 62, 4, 1514);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, t2);
    			insert_dev(target, t3, anchor);

    			for (let i = 0; i < 2; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			get_context$4(ctx);
    			if (dirty & /*detail*/ 32768 && t0_value !== (t0_value = /*tooltipData*/ ctx[16].channel_name + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*detail*/ 32768 && t2_value !== (t2_value = labelMap.get(/*tooltipData*/ ctx[16].cluster) + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*detail*/ 32768) {
    				set_style(div1, "--color", colorMap.get(/*tooltipData*/ ctx[16].cluster));
    			}

    			if (dirty & /*detail*/ 32768) {
    				each_value = ['total_videos', 'subscribers'];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < 2; i += 1) {
    					const child_ctx = get_each_context$j(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$j(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < 2; i += 1) {
    					each_blocks[i].d(1);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div1);
    			if (detaching) detach_dev(t3);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$5.name,
    		type: "slot",
    		source: "(57:3) <Tooltip     {evt}     let:detail    >",
    		ctx
    	});

    	return block;
    }

    // (49:1) <Html   pointerEvents={false}  >
    function create_default_slot_1$5(ctx) {
    	let t;
    	let if_block1_anchor;
    	let current;
    	let if_block0 = /*currentStep*/ ctx[1] === 2 && create_if_block_2$2(ctx);
    	let if_block1 = /*hideTooltip*/ ctx[12] !== true && /*currentStep*/ ctx[1] === 3 && create_if_block$i(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*currentStep*/ ctx[1] === 2) {
    				if (if_block0) {
    					if (dirty & /*currentStep*/ 2) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_2$2(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t.parentNode, t);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*hideTooltip*/ ctx[12] !== true && /*currentStep*/ ctx[1] === 3) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*hideTooltip, currentStep*/ 4098) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$i(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$5.name,
    		type: "slot",
    		source: "(49:1) <Html   pointerEvents={false}  >",
    		ctx
    	});

    	return block;
    }

    // (25:1) <LayerCake   x={ xKey }   { xScale }   { xDomain }   z={ zKey }   { zScale }   { zDomain }   { zRange }   r={ rKey }   { rRange }   { data }  >
    function create_default_slot$8(ctx) {
    	let svg;
    	let t;
    	let html;
    	let current;

    	svg = new Svg({
    			props: {
    				$$slots: { default: [create_default_slot_3$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	html = new Html({
    			props: {
    				pointerEvents: false,
    				$$slots: { default: [create_default_slot_1$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(svg.$$.fragment);
    			t = space();
    			create_component(html.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(svg, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(html, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const svg_changes = {};

    			if (dirty & /*$$scope, currentStep, evt, hideTooltip*/ 4200450) {
    				svg_changes.$$scope = { dirty, ctx };
    			}

    			svg.$set(svg_changes);
    			const html_changes = {};

    			if (dirty & /*$$scope, evt, hideTooltip, currentStep*/ 4200450) {
    				html_changes.$$scope = { dirty, ctx };
    			}

    			html.$set(html_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(svg.$$.fragment, local);
    			transition_in(html.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(svg.$$.fragment, local);
    			transition_out(html.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(svg, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(html, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$8.name,
    		type: "slot",
    		source: "(25:1) <LayerCake   x={ xKey }   { xScale }   { xDomain }   z={ zKey }   { zScale }   { zDomain }   { zRange }   r={ rKey }   { rRange }   { data }  >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$s(ctx) {
    	let div;
    	let layercake;
    	let current;

    	layercake = new LayerCake({
    			props: {
    				x: /*xKey*/ ctx[2],
    				xScale: /*xScale*/ ctx[3],
    				xDomain: /*xDomain*/ ctx[4],
    				z: /*zKey*/ ctx[5],
    				zScale: /*zScale*/ ctx[6],
    				zDomain: /*zDomain*/ ctx[7],
    				zRange: /*zRange*/ ctx[8],
    				r: /*rKey*/ ctx[9],
    				rRange: /*rRange*/ ctx[10],
    				data: /*data*/ ctx[0],
    				$$slots: { default: [create_default_slot$8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(layercake.$$.fragment);
    			attr_dev(div, "class", "chart beeswarm-chart svelte-szz4gu");
    			add_location(div, file$r, 23, 0, 794);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(layercake, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const layercake_changes = {};
    			if (dirty & /*xKey*/ 4) layercake_changes.x = /*xKey*/ ctx[2];
    			if (dirty & /*xScale*/ 8) layercake_changes.xScale = /*xScale*/ ctx[3];
    			if (dirty & /*xDomain*/ 16) layercake_changes.xDomain = /*xDomain*/ ctx[4];
    			if (dirty & /*zKey*/ 32) layercake_changes.z = /*zKey*/ ctx[5];
    			if (dirty & /*zScale*/ 64) layercake_changes.zScale = /*zScale*/ ctx[6];
    			if (dirty & /*zDomain*/ 128) layercake_changes.zDomain = /*zDomain*/ ctx[7];
    			if (dirty & /*zRange*/ 256) layercake_changes.zRange = /*zRange*/ ctx[8];
    			if (dirty & /*rKey*/ 512) layercake_changes.r = /*rKey*/ ctx[9];
    			if (dirty & /*rRange*/ 1024) layercake_changes.rRange = /*rRange*/ ctx[10];
    			if (dirty & /*data*/ 1) layercake_changes.data = /*data*/ ctx[0];

    			if (dirty & /*$$scope, evt, hideTooltip, currentStep*/ 4200450) {
    				layercake_changes.$$scope = { dirty, ctx };
    			}

    			layercake.$set(layercake_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(layercake.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(layercake.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(layercake);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$s.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$s($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Beeswarm', slots, []);
    	let { data } = $$props;
    	let { currentStep = 0 } = $$props;
    	let { xKey = 'channel' } = $$props;
    	let { xScale = linear() } = $$props;
    	let { xDomain = [null, null] } = $$props;
    	let { zKey = 'cluster' } = $$props;
    	let { zScale = ordinal() } = $$props;
    	let { zDomain = Array.from(new Set(data.map(d => d.cluster))) } = $$props;
    	let { zRange = zDomain.map(d => colorMap.get(d)) } = $$props;
    	let { rKey = 'subscribers' } = $$props;
    	let { rRange = [5, 28] } = $$props;
    	let evt;
    	let hideTooltip = true;

    	const writable_props = [
    		'data',
    		'currentStep',
    		'xKey',
    		'xScale',
    		'xDomain',
    		'zKey',
    		'zScale',
    		'zDomain',
    		'zRange',
    		'rKey',
    		'rRange'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Beeswarm> was created with unknown prop '${key}'`);
    	});

    	const mousemove_handler = event => $$invalidate(11, evt = $$invalidate(12, hideTooltip = event));
    	const mouseout_handler = () => $$invalidate(12, hideTooltip = true);

    	$$self.$$set = $$props => {
    		if ('data' in $$props) $$invalidate(0, data = $$props.data);
    		if ('currentStep' in $$props) $$invalidate(1, currentStep = $$props.currentStep);
    		if ('xKey' in $$props) $$invalidate(2, xKey = $$props.xKey);
    		if ('xScale' in $$props) $$invalidate(3, xScale = $$props.xScale);
    		if ('xDomain' in $$props) $$invalidate(4, xDomain = $$props.xDomain);
    		if ('zKey' in $$props) $$invalidate(5, zKey = $$props.zKey);
    		if ('zScale' in $$props) $$invalidate(6, zScale = $$props.zScale);
    		if ('zDomain' in $$props) $$invalidate(7, zDomain = $$props.zDomain);
    		if ('zRange' in $$props) $$invalidate(8, zRange = $$props.zRange);
    		if ('rKey' in $$props) $$invalidate(9, rKey = $$props.rKey);
    		if ('rRange' in $$props) $$invalidate(10, rRange = $$props.rRange);
    	};

    	$$self.$capture_state = () => ({
    		LayerCake,
    		Svg,
    		Html,
    		scaleLinear: linear,
    		scaleOrdinal: ordinal,
    		Force,
    		Labels,
    		Tooltip,
    		colorMap,
    		labelMap,
    		data,
    		currentStep,
    		xKey,
    		xScale,
    		xDomain,
    		zKey,
    		zScale,
    		zDomain,
    		zRange,
    		rKey,
    		rRange,
    		evt,
    		hideTooltip
    	});

    	$$self.$inject_state = $$props => {
    		if ('data' in $$props) $$invalidate(0, data = $$props.data);
    		if ('currentStep' in $$props) $$invalidate(1, currentStep = $$props.currentStep);
    		if ('xKey' in $$props) $$invalidate(2, xKey = $$props.xKey);
    		if ('xScale' in $$props) $$invalidate(3, xScale = $$props.xScale);
    		if ('xDomain' in $$props) $$invalidate(4, xDomain = $$props.xDomain);
    		if ('zKey' in $$props) $$invalidate(5, zKey = $$props.zKey);
    		if ('zScale' in $$props) $$invalidate(6, zScale = $$props.zScale);
    		if ('zDomain' in $$props) $$invalidate(7, zDomain = $$props.zDomain);
    		if ('zRange' in $$props) $$invalidate(8, zRange = $$props.zRange);
    		if ('rKey' in $$props) $$invalidate(9, rKey = $$props.rKey);
    		if ('rRange' in $$props) $$invalidate(10, rRange = $$props.rRange);
    		if ('evt' in $$props) $$invalidate(11, evt = $$props.evt);
    		if ('hideTooltip' in $$props) $$invalidate(12, hideTooltip = $$props.hideTooltip);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		data,
    		currentStep,
    		xKey,
    		xScale,
    		xDomain,
    		zKey,
    		zScale,
    		zDomain,
    		zRange,
    		rKey,
    		rRange,
    		evt,
    		hideTooltip,
    		mousemove_handler,
    		mouseout_handler
    	];
    }

    class Beeswarm extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$s, create_fragment$s, safe_not_equal, {
    			data: 0,
    			currentStep: 1,
    			xKey: 2,
    			xScale: 3,
    			xDomain: 4,
    			zKey: 5,
    			zScale: 6,
    			zDomain: 7,
    			zRange: 8,
    			rKey: 9,
    			rRange: 10
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Beeswarm",
    			options,
    			id: create_fragment$s.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*data*/ ctx[0] === undefined && !('data' in props)) {
    			console.warn("<Beeswarm> was created without expected prop 'data'");
    		}
    	}

    	get data() {
    		throw new Error("<Beeswarm>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<Beeswarm>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get currentStep() {
    		throw new Error("<Beeswarm>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set currentStep(value) {
    		throw new Error("<Beeswarm>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xKey() {
    		throw new Error("<Beeswarm>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xKey(value) {
    		throw new Error("<Beeswarm>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xScale() {
    		throw new Error("<Beeswarm>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xScale(value) {
    		throw new Error("<Beeswarm>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xDomain() {
    		throw new Error("<Beeswarm>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xDomain(value) {
    		throw new Error("<Beeswarm>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get zKey() {
    		throw new Error("<Beeswarm>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set zKey(value) {
    		throw new Error("<Beeswarm>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get zScale() {
    		throw new Error("<Beeswarm>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set zScale(value) {
    		throw new Error("<Beeswarm>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get zDomain() {
    		throw new Error("<Beeswarm>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set zDomain(value) {
    		throw new Error("<Beeswarm>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get zRange() {
    		throw new Error("<Beeswarm>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set zRange(value) {
    		throw new Error("<Beeswarm>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rKey() {
    		throw new Error("<Beeswarm>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rKey(value) {
    		throw new Error("<Beeswarm>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rRange() {
    		throw new Error("<Beeswarm>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rRange(value) {
    		throw new Error("<Beeswarm>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function comparator(val, scaler) {
        return function (a, b) { return scaler(a[val]) - scaler(b[val]); };
    }

    /* src/components/main/ScrollSection.svelte generated by Svelte v3.49.0 */

    const { Object: Object_1$3 } = globals;
    const file$q = "src/components/main/ScrollSection.svelte";

    function get_each_context$i(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	child_ctx[11] = i;
    	return child_ctx;
    }

    // (50:4) {#if channelData && channelData.length}
    function create_if_block$h(ctx) {
    	let beeswarm;
    	let current;

    	beeswarm = new Beeswarm({
    			props: {
    				currentStep: /*currentStep*/ ctx[1],
    				xKey: /*xKey*/ ctx[2],
    				xScale: /*xScale*/ ctx[3],
    				xDomain: /*xDomain*/ ctx[4],
    				data: /*channelData*/ ctx[0]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(beeswarm.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(beeswarm, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const beeswarm_changes = {};
    			if (dirty & /*currentStep*/ 2) beeswarm_changes.currentStep = /*currentStep*/ ctx[1];
    			if (dirty & /*xKey*/ 4) beeswarm_changes.xKey = /*xKey*/ ctx[2];
    			if (dirty & /*xScale*/ 8) beeswarm_changes.xScale = /*xScale*/ ctx[3];
    			if (dirty & /*xDomain*/ 16) beeswarm_changes.xDomain = /*xDomain*/ ctx[4];
    			if (dirty & /*channelData*/ 1) beeswarm_changes.data = /*channelData*/ ctx[0];
    			beeswarm.$set(beeswarm_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(beeswarm.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(beeswarm.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(beeswarm, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$h.name,
    		type: "if",
    		source: "(50:4) {#if channelData && channelData.length}",
    		ctx
    	});

    	return block;
    }

    // (54:8) {#each steps as text, i}
    function create_each_block$i(ctx) {
    	let div1;
    	let div0;
    	let raw_value = /*text*/ ctx[9] + "";
    	let t;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			t = space();
    			attr_dev(div0, "class", "step-content svelte-1vjm4tq");
    			add_location(div0, file$q, 55, 16, 1938);
    			attr_dev(div1, "class", "step svelte-1vjm4tq");
    			toggle_class(div1, "active", /*currentStep*/ ctx[1] === /*i*/ ctx[11]);
    			add_location(div1, file$q, 54, 12, 1870);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			div0.innerHTML = raw_value;
    			append_dev(div1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*currentStep*/ 2) {
    				toggle_class(div1, "active", /*currentStep*/ ctx[1] === /*i*/ ctx[11]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$i.name,
    		type: "each",
    		source: "(54:8) {#each steps as text, i}",
    		ctx
    	});

    	return block;
    }

    // (53:4) <Scroller bind:value={currentStep}>
    function create_default_slot$7(ctx) {
    	let each_1_anchor;
    	let each_value = /*steps*/ ctx[5];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$i(get_each_context$i(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*currentStep, steps*/ 34) {
    				each_value = /*steps*/ ctx[5];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$i(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$i(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$7.name,
    		type: "slot",
    		source: "(53:4) <Scroller bind:value={currentStep}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$r(ctx) {
    	let div;
    	let t;
    	let scroller;
    	let updating_value;
    	let current;
    	let if_block = /*channelData*/ ctx[0] && /*channelData*/ ctx[0].length && create_if_block$h(ctx);

    	function scroller_value_binding(value) {
    		/*scroller_value_binding*/ ctx[6](value);
    	}

    	let scroller_props = {
    		$$slots: { default: [create_default_slot$7] },
    		$$scope: { ctx }
    	};

    	if (/*currentStep*/ ctx[1] !== void 0) {
    		scroller_props.value = /*currentStep*/ ctx[1];
    	}

    	scroller = new Scrolly({ props: scroller_props, $$inline: true });
    	binding_callbacks.push(() => bind(scroller, 'value', scroller_value_binding));

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			t = space();
    			create_component(scroller.$$.fragment);
    			attr_dev(div, "class", "scroller-wrapper svelte-1vjm4tq");
    			add_location(div, file$q, 48, 0, 1602);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			append_dev(div, t);
    			mount_component(scroller, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*channelData*/ ctx[0] && /*channelData*/ ctx[0].length) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*channelData*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$h(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div, t);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			const scroller_changes = {};

    			if (dirty & /*$$scope, currentStep*/ 4098) {
    				scroller_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value && dirty & /*currentStep*/ 2) {
    				updating_value = true;
    				scroller_changes.value = /*currentStep*/ ctx[1];
    				add_flush_callback(() => updating_value = false);
    			}

    			scroller.$set(scroller_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			transition_in(scroller.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			transition_out(scroller.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    			destroy_component(scroller);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$r.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$r($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ScrollSection', slots, []);
    	let channelData;
    	let currentStep;

    	const steps = [
    		"<p>Here are the top 200 YouTube channels we monitor.</p>",
    		"<p>Organized by their size.</p>",
    		"<p>Clustered together</p>",
    		"<p>Explore the data before we dive deeper into the politics of YouTube.</p>"
    	];

    	let xKey = 'channel';
    	let xScale = linear();
    	let xDomain = [null, null];
    	const leftRightScale = ordinal().domain(['fL', 'L', 'C', 'AW', 'R', 'fR']).range([0, 1, 2, 3, 4, 5]);
    	const spectrum = comparator('cluster', leftRightScale);

    	onMount(async () => {
    		const res = await csv('assets/data/channels_top250.csv', autoType);
    		$$invalidate(0, channelData = res);
    		channelData.sort(spectrum);
    		$$invalidate(0, channelData = channelData.map((d, i) => Object.assign(Object.assign({}, d), { channel: i })));
    	});

    	const writable_props = [];

    	Object_1$3.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ScrollSection> was created with unknown prop '${key}'`);
    	});

    	function scroller_value_binding(value) {
    		currentStep = value;
    		$$invalidate(1, currentStep);
    	}

    	$$self.$capture_state = () => ({
    		onMount,
    		csv,
    		autoType,
    		scaleLinear: linear,
    		scaleOrdinal: ordinal,
    		scaleBand: band,
    		scaleLog: log$1,
    		Scroller: Scrolly,
    		Beeswarm,
    		comparator,
    		channelData,
    		currentStep,
    		steps,
    		xKey,
    		xScale,
    		xDomain,
    		leftRightScale,
    		spectrum
    	});

    	$$self.$inject_state = $$props => {
    		if ('channelData' in $$props) $$invalidate(0, channelData = $$props.channelData);
    		if ('currentStep' in $$props) $$invalidate(1, currentStep = $$props.currentStep);
    		if ('xKey' in $$props) $$invalidate(2, xKey = $$props.xKey);
    		if ('xScale' in $$props) $$invalidate(3, xScale = $$props.xScale);
    		if ('xDomain' in $$props) $$invalidate(4, xDomain = $$props.xDomain);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*currentStep, channelData*/ 3) {
    			if (currentStep == 0) ; else if (currentStep == 1) {
    				$$invalidate(2, xKey = 'subscribers');
    				$$invalidate(3, xScale = log$1());
    				$$invalidate(4, xDomain = [null, null]);
    			} else if (currentStep == 2) {
    				$$invalidate(2, xKey = 'cluster');
    				$$invalidate(3, xScale = band());
    				$$invalidate(4, xDomain = ['fL', 'L', 'C', 'AW', 'R', 'fR']);
    			} else if (currentStep == 3) {
    				$$invalidate(2, xKey = 'index');
    				$$invalidate(3, xScale = linear());
    				$$invalidate(4, xDomain = [null, null]);
    				$$invalidate(0, channelData = channelData.map((d, i) => Object.assign(Object.assign({}, d), { index: i })));
    			}
    		}
    	};

    	return [channelData, currentStep, xKey, xScale, xDomain, steps, scroller_value_binding];
    }

    class ScrollSection extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$r, create_fragment$r, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ScrollSection",
    			options,
    			id: create_fragment$r.name
    		});
    	}
    }

    /* src/components/main/Main.svelte generated by Svelte v3.49.0 */
    const file$p = "src/components/main/Main.svelte";

    function create_fragment$q(ctx) {
    	let main;
    	let title_1;
    	let t0;
    	let description;
    	let t1;
    	let authors_1;
    	let t2;
    	let scrollsection;
    	let current;

    	title_1 = new Title({
    			props: { title: /*title*/ ctx[0] },
    			$$inline: true
    		});

    	description = new Description({
    			props: { text: /*text*/ ctx[1] },
    			$$inline: true
    		});

    	authors_1 = new Authors({
    			props: { authors: /*authors*/ ctx[2] },
    			$$inline: true
    		});

    	scrollsection = new ScrollSection({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(title_1.$$.fragment);
    			t0 = space();
    			create_component(description.$$.fragment);
    			t1 = space();
    			create_component(authors_1.$$.fragment);
    			t2 = space();
    			create_component(scrollsection.$$.fragment);
    			attr_dev(main, "class", "svelte-1wkni80");
    			add_location(main, file$p, 15, 0, 589);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(title_1, main, null);
    			append_dev(main, t0);
    			mount_component(description, main, null);
    			append_dev(main, t1);
    			mount_component(authors_1, main, null);
    			append_dev(main, t2);
    			mount_component(scrollsection, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const title_1_changes = {};
    			if (dirty & /*title*/ 1) title_1_changes.title = /*title*/ ctx[0];
    			title_1.$set(title_1_changes);
    			const description_changes = {};
    			if (dirty & /*text*/ 2) description_changes.text = /*text*/ ctx[1];
    			description.$set(description_changes);
    			const authors_1_changes = {};
    			if (dirty & /*authors*/ 4) authors_1_changes.authors = /*authors*/ ctx[2];
    			authors_1.$set(authors_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(title_1.$$.fragment, local);
    			transition_in(description.$$.fragment, local);
    			transition_in(authors_1.$$.fragment, local);
    			transition_in(scrollsection.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(title_1.$$.fragment, local);
    			transition_out(description.$$.fragment, local);
    			transition_out(authors_1.$$.fragment, local);
    			transition_out(scrollsection.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(title_1);
    			destroy_component(description);
    			destroy_component(authors_1);
    			destroy_component(scrollsection);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$q.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$q($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Main', slots, []);
    	let { title } = $$props;
    	let { text = 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Commodi consequatur inventore exercitationem ex perferendis provident, earum cumque maiores quam quidem labore, mollitia odit eaque laborum?' } = $$props;
    	let { authors } = $$props;

    	const fig3b = {
    		type: 'line',
    		xKey: 'date',
    		yKey: 'median_user_watchtime',
    		zKey: 'label'
    	};

    	const writable_props = ['title', 'text', 'authors'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Main> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('text' in $$props) $$invalidate(1, text = $$props.text);
    		if ('authors' in $$props) $$invalidate(2, authors = $$props.authors);
    	};

    	$$self.$capture_state = () => ({
    		Title,
    		Description,
    		Authors,
    		ScrollSection,
    		title,
    		text,
    		authors,
    		fig3b
    	});

    	$$self.$inject_state = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('text' in $$props) $$invalidate(1, text = $$props.text);
    		if ('authors' in $$props) $$invalidate(2, authors = $$props.authors);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [title, text, authors];
    }

    class Main extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$q, create_fragment$q, safe_not_equal, { title: 0, text: 1, authors: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Main",
    			options,
    			id: create_fragment$q.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*title*/ ctx[0] === undefined && !('title' in props)) {
    			console.warn("<Main> was created without expected prop 'title'");
    		}

    		if (/*authors*/ ctx[2] === undefined && !('authors' in props)) {
    			console.warn("<Main> was created without expected prop 'authors'");
    		}
    	}

    	get title() {
    		throw new Error("<Main>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Main>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get text() {
    		throw new Error("<Main>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<Main>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get authors() {
    		throw new Error("<Main>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set authors(value) {
    		throw new Error("<Main>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /**
     * This action triggers a custom event on node entering/exiting the viewport.
     * example:
     * <p
     * 	use:inView
     * 	on:enter={() => console.log("enter")}
     * 	on:exit={() => console.log("exit")}
     * >
     * 
     * optional params { root, top, bottom, once }
     * top and bottom are numbers
     * once is a boolean
     * use:inView={ bottom: 100 } // 100 pixels from bottom of viewport
     */

     function inView(node, params = {}) {
    	let observer;

    	const handleIntersect = (e) => {
    		const v = e[0].isIntersecting ? "enter" : "exit";
    		if (v === 'enter') node.dispatchEvent(new CustomEvent(v));
    		if (v === 'enter' && params.once) observer.disconnect();
    	};
    	
    	const setObserver = ({ root, top, bottom }) => {
    		const marginTop = top ? top * -1 : 0;
    		const marginBottom = bottom ? bottom * -1 : 0;
    		const rootMargin = `${marginTop}px 0px ${marginBottom}px 0px`;
    		const options = { root, rootMargin };
    		if (observer) observer.disconnect();
    		observer = new IntersectionObserver(handleIntersect, options);		observer.observe(node);
    	};

    	setObserver(params);

    	return {
    		update(params) {
    			setObserver(params);
    		},

    		destroy() {
    			if (observer) observer.disconnect();
    		}
    	};
    }

    const pi = Math.PI,
        tau = 2 * pi,
        epsilon = 1e-6,
        tauEpsilon = tau - epsilon;

    function Path() {
      this._x0 = this._y0 = // start of current subpath
      this._x1 = this._y1 = null; // end of current subpath
      this._ = "";
    }

    function path() {
      return new Path;
    }

    Path.prototype = path.prototype = {
      constructor: Path,
      moveTo: function(x, y) {
        this._ += "M" + (this._x0 = this._x1 = +x) + "," + (this._y0 = this._y1 = +y);
      },
      closePath: function() {
        if (this._x1 !== null) {
          this._x1 = this._x0, this._y1 = this._y0;
          this._ += "Z";
        }
      },
      lineTo: function(x, y) {
        this._ += "L" + (this._x1 = +x) + "," + (this._y1 = +y);
      },
      quadraticCurveTo: function(x1, y1, x, y) {
        this._ += "Q" + (+x1) + "," + (+y1) + "," + (this._x1 = +x) + "," + (this._y1 = +y);
      },
      bezierCurveTo: function(x1, y1, x2, y2, x, y) {
        this._ += "C" + (+x1) + "," + (+y1) + "," + (+x2) + "," + (+y2) + "," + (this._x1 = +x) + "," + (this._y1 = +y);
      },
      arcTo: function(x1, y1, x2, y2, r) {
        x1 = +x1, y1 = +y1, x2 = +x2, y2 = +y2, r = +r;
        var x0 = this._x1,
            y0 = this._y1,
            x21 = x2 - x1,
            y21 = y2 - y1,
            x01 = x0 - x1,
            y01 = y0 - y1,
            l01_2 = x01 * x01 + y01 * y01;

        // Is the radius negative? Error.
        if (r < 0) throw new Error("negative radius: " + r);

        // Is this path empty? Move to (x1,y1).
        if (this._x1 === null) {
          this._ += "M" + (this._x1 = x1) + "," + (this._y1 = y1);
        }

        // Or, is (x1,y1) coincident with (x0,y0)? Do nothing.
        else if (!(l01_2 > epsilon));

        // Or, are (x0,y0), (x1,y1) and (x2,y2) collinear?
        // Equivalently, is (x1,y1) coincident with (x2,y2)?
        // Or, is the radius zero? Line to (x1,y1).
        else if (!(Math.abs(y01 * x21 - y21 * x01) > epsilon) || !r) {
          this._ += "L" + (this._x1 = x1) + "," + (this._y1 = y1);
        }

        // Otherwise, draw an arc!
        else {
          var x20 = x2 - x0,
              y20 = y2 - y0,
              l21_2 = x21 * x21 + y21 * y21,
              l20_2 = x20 * x20 + y20 * y20,
              l21 = Math.sqrt(l21_2),
              l01 = Math.sqrt(l01_2),
              l = r * Math.tan((pi - Math.acos((l21_2 + l01_2 - l20_2) / (2 * l21 * l01))) / 2),
              t01 = l / l01,
              t21 = l / l21;

          // If the start tangent is not coincident with (x0,y0), line to.
          if (Math.abs(t01 - 1) > epsilon) {
            this._ += "L" + (x1 + t01 * x01) + "," + (y1 + t01 * y01);
          }

          this._ += "A" + r + "," + r + ",0,0," + (+(y01 * x20 > x01 * y20)) + "," + (this._x1 = x1 + t21 * x21) + "," + (this._y1 = y1 + t21 * y21);
        }
      },
      arc: function(x, y, r, a0, a1, ccw) {
        x = +x, y = +y, r = +r, ccw = !!ccw;
        var dx = r * Math.cos(a0),
            dy = r * Math.sin(a0),
            x0 = x + dx,
            y0 = y + dy,
            cw = 1 ^ ccw,
            da = ccw ? a0 - a1 : a1 - a0;

        // Is the radius negative? Error.
        if (r < 0) throw new Error("negative radius: " + r);

        // Is this path empty? Move to (x0,y0).
        if (this._x1 === null) {
          this._ += "M" + x0 + "," + y0;
        }

        // Or, is (x0,y0) not coincident with the previous point? Line to (x0,y0).
        else if (Math.abs(this._x1 - x0) > epsilon || Math.abs(this._y1 - y0) > epsilon) {
          this._ += "L" + x0 + "," + y0;
        }

        // Is this arc empty? We’re done.
        if (!r) return;

        // Does the angle go the wrong way? Flip the direction.
        if (da < 0) da = da % tau + tau;

        // Is this a complete circle? Draw two arcs to complete the circle.
        if (da > tauEpsilon) {
          this._ += "A" + r + "," + r + ",0,1," + cw + "," + (x - dx) + "," + (y - dy) + "A" + r + "," + r + ",0,1," + cw + "," + (this._x1 = x0) + "," + (this._y1 = y0);
        }

        // Is this arc non-empty? Draw an arc!
        else if (da > epsilon) {
          this._ += "A" + r + "," + r + ",0," + (+(da >= pi)) + "," + cw + "," + (this._x1 = x + r * Math.cos(a1)) + "," + (this._y1 = y + r * Math.sin(a1));
        }
      },
      rect: function(x, y, w, h) {
        this._ += "M" + (this._x0 = this._x1 = +x) + "," + (this._y0 = this._y1 = +y) + "h" + (+w) + "v" + (+h) + "h" + (-w) + "Z";
      },
      toString: function() {
        return this._;
      }
    };

    function constant(x) {
      return function constant() {
        return x;
      };
    }

    function array(x) {
      return typeof x === "object" && "length" in x
        ? x // Array, TypedArray, NodeList, array-like
        : Array.from(x); // Map, Set, iterable, string, or anything else
    }

    function Linear(context) {
      this._context = context;
    }

    Linear.prototype = {
      areaStart: function() {
        this._line = 0;
      },
      areaEnd: function() {
        this._line = NaN;
      },
      lineStart: function() {
        this._point = 0;
      },
      lineEnd: function() {
        if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
        this._line = 1 - this._line;
      },
      point: function(x, y) {
        x = +x, y = +y;
        switch (this._point) {
          case 0: this._point = 1; this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y); break;
          case 1: this._point = 2; // falls through
          default: this._context.lineTo(x, y); break;
        }
      }
    };

    function curveLinear(context) {
      return new Linear(context);
    }

    function x(p) {
      return p[0];
    }

    function y(p) {
      return p[1];
    }

    function line(x$1, y$1) {
      var defined = constant(true),
          context = null,
          curve = curveLinear,
          output = null;

      x$1 = typeof x$1 === "function" ? x$1 : (x$1 === undefined) ? x : constant(x$1);
      y$1 = typeof y$1 === "function" ? y$1 : (y$1 === undefined) ? y : constant(y$1);

      function line(data) {
        var i,
            n = (data = array(data)).length,
            d,
            defined0 = false,
            buffer;

        if (context == null) output = curve(buffer = path());

        for (i = 0; i <= n; ++i) {
          if (!(i < n && defined(d = data[i], i, data)) === defined0) {
            if (defined0 = !defined0) output.lineStart();
            else output.lineEnd();
          }
          if (defined0) output.point(+x$1(d, i, data), +y$1(d, i, data));
        }

        if (buffer) return output = null, buffer + "" || null;
      }

      line.x = function(_) {
        return arguments.length ? (x$1 = typeof _ === "function" ? _ : constant(+_), line) : x$1;
      };

      line.y = function(_) {
        return arguments.length ? (y$1 = typeof _ === "function" ? _ : constant(+_), line) : y$1;
      };

      line.defined = function(_) {
        return arguments.length ? (defined = typeof _ === "function" ? _ : constant(!!_), line) : defined;
      };

      line.curve = function(_) {
        return arguments.length ? (curve = _, context != null && (output = curve(context)), line) : curve;
      };

      line.context = function(_) {
        return arguments.length ? (_ == null ? context = output = null : output = curve(context = _), line) : context;
      };

      return line;
    }

    function point(that, x, y) {
      that._context.bezierCurveTo(
        (2 * that._x0 + that._x1) / 3,
        (2 * that._y0 + that._y1) / 3,
        (that._x0 + 2 * that._x1) / 3,
        (that._y0 + 2 * that._y1) / 3,
        (that._x0 + 4 * that._x1 + x) / 6,
        (that._y0 + 4 * that._y1 + y) / 6
      );
    }

    function Basis(context) {
      this._context = context;
    }

    Basis.prototype = {
      areaStart: function() {
        this._line = 0;
      },
      areaEnd: function() {
        this._line = NaN;
      },
      lineStart: function() {
        this._x0 = this._x1 =
        this._y0 = this._y1 = NaN;
        this._point = 0;
      },
      lineEnd: function() {
        switch (this._point) {
          case 3: point(this, this._x1, this._y1); // falls through
          case 2: this._context.lineTo(this._x1, this._y1); break;
        }
        if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
        this._line = 1 - this._line;
      },
      point: function(x, y) {
        x = +x, y = +y;
        switch (this._point) {
          case 0: this._point = 1; this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y); break;
          case 1: this._point = 2; break;
          case 2: this._point = 3; this._context.lineTo((5 * this._x0 + this._x1) / 6, (5 * this._y0 + this._y1) / 6); // falls through
          default: point(this, x, y); break;
        }
        this._x0 = this._x1, this._x1 = x;
        this._y0 = this._y1, this._y1 = y;
      }
    };

    function curveBasis(context) {
      return new Basis(context);
    }

    function none$1(series, order) {
      if (!((n = series.length) > 1)) return;
      for (var i = 1, j, s0, s1 = series[order[0]], n, m = s1.length; i < n; ++i) {
        s0 = s1, s1 = series[order[i]];
        for (j = 0; j < m; ++j) {
          s1[j][1] += s1[j][0] = isNaN(s0[j][1]) ? s0[j][0] : s0[j][1];
        }
      }
    }

    function none(series) {
      var n = series.length, o = new Array(n);
      while (--n >= 0) o[n] = n;
      return o;
    }

    function stackValue(d, key) {
      return d[key];
    }

    function stackSeries(key) {
      const series = [];
      series.key = key;
      return series;
    }

    function stack() {
      var keys = constant([]),
          order = none,
          offset = none$1,
          value = stackValue;

      function stack(data) {
        var sz = Array.from(keys.apply(this, arguments), stackSeries),
            i, n = sz.length, j = -1,
            oz;

        for (const d of data) {
          for (i = 0, ++j; i < n; ++i) {
            (sz[i][j] = [0, +value(d, sz[i].key, j, data)]).data = d;
          }
        }

        for (i = 0, oz = array(order(sz)); i < n; ++i) {
          sz[oz[i]].index = i;
        }

        offset(sz, oz);
        return sz;
      }

      stack.keys = function(_) {
        return arguments.length ? (keys = typeof _ === "function" ? _ : constant(Array.from(_)), stack) : keys;
      };

      stack.value = function(_) {
        return arguments.length ? (value = typeof _ === "function" ? _ : constant(+_), stack) : value;
      };

      stack.order = function(_) {
        return arguments.length ? (order = _ == null ? none : typeof _ === "function" ? _ : constant(Array.from(_)), stack) : order;
      };

      stack.offset = function(_) {
        return arguments.length ? (offset = _ == null ? none$1 : _, stack) : offset;
      };

      return stack;
    }

    /* src/components/graphs/atoms/Multiline.svelte generated by Svelte v3.49.0 */
    const file$o = "src/components/graphs/atoms/Multiline.svelte";

    function get_each_context$h(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i];
    	child_ctx[12] = i;
    	return child_ctx;
    }

    // (12:2) {#each $data as group, i}
    function create_each_block$h(ctx) {
    	let path_1;
    	let path_1_class_value;
    	let path_1_d_value;
    	let path_1_stroke_value;

    	const block = {
    		c: function create() {
    			path_1 = svg_element("path");
    			attr_dev(path_1, "class", path_1_class_value = "" + (null_to_empty(`path-line path-${/*group*/ ctx[10][0]}`) + " svelte-15s3r1r"));
    			attr_dev(path_1, "d", path_1_d_value = /*path*/ ctx[1](/*group*/ ctx[10][1]));
    			attr_dev(path_1, "stroke", path_1_stroke_value = /*$zGet*/ ctx[3](/*group*/ ctx[10][1][0]));
    			add_location(path_1, file$o, 12, 4, 363);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, path_1, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$data*/ 4 && path_1_class_value !== (path_1_class_value = "" + (null_to_empty(`path-line path-${/*group*/ ctx[10][0]}`) + " svelte-15s3r1r"))) {
    				attr_dev(path_1, "class", path_1_class_value);
    			}

    			if (dirty & /*path, $data*/ 6 && path_1_d_value !== (path_1_d_value = /*path*/ ctx[1](/*group*/ ctx[10][1]))) {
    				attr_dev(path_1, "d", path_1_d_value);
    			}

    			if (dirty & /*$zGet, $data*/ 12 && path_1_stroke_value !== (path_1_stroke_value = /*$zGet*/ ctx[3](/*group*/ ctx[10][1][0]))) {
    				attr_dev(path_1, "stroke", path_1_stroke_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(path_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$h.name,
    		type: "each",
    		source: "(12:2) {#each $data as group, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$p(ctx) {
    	let g;
    	let g_class_value;
    	let each_value = /*$data*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$h(get_each_context$h(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			g = svg_element("g");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(g, "class", g_class_value = "" + (null_to_empty(`line-group line-group-${/*activeChart*/ ctx[0]}`) + " svelte-15s3r1r"));
    			add_location(g, file$o, 10, 0, 280);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, g, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(g, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$data, path, $zGet*/ 14) {
    				each_value = /*$data*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$h(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$h(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(g, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*activeChart*/ 1 && g_class_value !== (g_class_value = "" + (null_to_empty(`line-group line-group-${/*activeChart*/ ctx[0]}`) + " svelte-15s3r1r"))) {
    				attr_dev(g, "class", g_class_value);
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(g);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$p.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$p($$self, $$props, $$invalidate) {
    	let path;
    	let $yGet;
    	let $xGet;
    	let $data;
    	let $zGet;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Multiline', slots, []);
    	const { data, xGet, yGet, zGet } = getContext('LayerCake');
    	validate_store(data, 'data');
    	component_subscribe($$self, data, value => $$invalidate(2, $data = value));
    	validate_store(xGet, 'xGet');
    	component_subscribe($$self, xGet, value => $$invalidate(9, $xGet = value));
    	validate_store(yGet, 'yGet');
    	component_subscribe($$self, yGet, value => $$invalidate(8, $yGet = value));
    	validate_store(zGet, 'zGet');
    	component_subscribe($$self, zGet, value => $$invalidate(3, $zGet = value));
    	let { activeChart } = $$props;
    	const writable_props = ['activeChart'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Multiline> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('activeChart' in $$props) $$invalidate(0, activeChart = $$props.activeChart);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		line,
    		curveBasis,
    		data,
    		xGet,
    		yGet,
    		zGet,
    		activeChart,
    		path,
    		$yGet,
    		$xGet,
    		$data,
    		$zGet
    	});

    	$$self.$inject_state = $$props => {
    		if ('activeChart' in $$props) $$invalidate(0, activeChart = $$props.activeChart);
    		if ('path' in $$props) $$invalidate(1, path = $$props.path);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$xGet, $yGet*/ 768) {
    			$$invalidate(1, path = line().x(d => $xGet(d)).y(d => $yGet(d)).curve(curveBasis));
    		}
    	};

    	return [activeChart, path, $data, $zGet, data, xGet, yGet, zGet, $yGet, $xGet];
    }

    class Multiline extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$p, create_fragment$p, safe_not_equal, { activeChart: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Multiline",
    			options,
    			id: create_fragment$p.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*activeChart*/ ctx[0] === undefined && !('activeChart' in props)) {
    			console.warn("<Multiline> was created without expected prop 'activeChart'");
    		}
    	}

    	get activeChart() {
    		throw new Error("<Multiline>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set activeChart(value) {
    		throw new Error("<Multiline>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/graphs/atoms/AxisX.svelte generated by Svelte v3.49.0 */
    const file$n = "src/components/graphs/atoms/AxisX.svelte";

    function get_each_context$g(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[19] = list[i];
    	child_ctx[21] = i;
    	return child_ctx;
    }

    // (54:6) {#if gridlines !== false}
    function create_if_block_2$1(ctx) {
    	let line;
    	let line_y__value;

    	const block = {
    		c: function create() {
    			line = svg_element("line");
    			attr_dev(line, "class", "gridline svelte-11s23aw");
    			attr_dev(line, "y1", line_y__value = /*$height*/ ctx[11] * -1);
    			attr_dev(line, "y2", "0");
    			attr_dev(line, "x1", "0");
    			attr_dev(line, "x2", "0");
    			add_location(line, file$n, 54, 8, 2092);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, line, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$height*/ 2048 && line_y__value !== (line_y__value = /*$height*/ ctx[11] * -1)) {
    				attr_dev(line, "y1", line_y__value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(line);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(54:6) {#if gridlines !== false}",
    		ctx
    	});

    	return block;
    }

    // (57:6) {#if tickMarks === true}
    function create_if_block_1$7(ctx) {
    	let line;
    	let line_x__value;
    	let line_x__value_1;

    	const block = {
    		c: function create() {
    			line = svg_element("line");
    			attr_dev(line, "class", "tick-mark svelte-11s23aw");
    			attr_dev(line, "y1", 0);
    			attr_dev(line, "y2", 6);

    			attr_dev(line, "x1", line_x__value = /*xTick*/ ctx[5] || /*isBandwidth*/ ctx[7]
    			? /*$xScale*/ ctx[8].bandwidth() / 2
    			: 0);

    			attr_dev(line, "x2", line_x__value_1 = /*xTick*/ ctx[5] || /*isBandwidth*/ ctx[7]
    			? /*$xScale*/ ctx[8].bandwidth() / 2
    			: 0);

    			add_location(line, file$n, 57, 8, 2215);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, line, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*xTick, isBandwidth, $xScale*/ 416 && line_x__value !== (line_x__value = /*xTick*/ ctx[5] || /*isBandwidth*/ ctx[7]
    			? /*$xScale*/ ctx[8].bandwidth() / 2
    			: 0)) {
    				attr_dev(line, "x1", line_x__value);
    			}

    			if (dirty & /*xTick, isBandwidth, $xScale*/ 416 && line_x__value_1 !== (line_x__value_1 = /*xTick*/ ctx[5] || /*isBandwidth*/ ctx[7]
    			? /*$xScale*/ ctx[8].bandwidth() / 2
    			: 0)) {
    				attr_dev(line, "x2", line_x__value_1);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(line);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$7.name,
    		type: "if",
    		source: "(57:6) {#if tickMarks === true}",
    		ctx
    	});

    	return block;
    }

    // (52:2) {#each tickVals as tick, i}
    function create_each_block$g(ctx) {
    	let g;
    	let if_block0_anchor;
    	let text_1;
    	let t_value = /*formatTick*/ ctx[4](/*tick*/ ctx[19]) + "";
    	let t;
    	let text_1_x_value;
    	let g_transform_value;
    	let if_block0 = /*gridlines*/ ctx[0] !== false && create_if_block_2$1(ctx);
    	let if_block1 = /*tickMarks*/ ctx[1] === true && create_if_block_1$7(ctx);

    	const block = {
    		c: function create() {
    			g = svg_element("g");
    			if (if_block0) if_block0.c();
    			if_block0_anchor = empty();
    			if (if_block1) if_block1.c();
    			text_1 = svg_element("text");
    			t = text$1(t_value);

    			attr_dev(text_1, "x", text_1_x_value = /*xTick*/ ctx[5] || /*isBandwidth*/ ctx[7]
    			? /*$xScale*/ ctx[8].bandwidth() / 2
    			: 0);

    			attr_dev(text_1, "y", /*yTick*/ ctx[6]);
    			attr_dev(text_1, "dx", "");
    			attr_dev(text_1, "dy", "");
    			attr_dev(text_1, "text-anchor", /*textAnchor*/ ctx[17](/*i*/ ctx[21]));
    			attr_dev(text_1, "class", "svelte-11s23aw");
    			add_location(text_1, file$n, 59, 6, 2399);
    			attr_dev(g, "class", "tick tick-" + /*i*/ ctx[21] + " svelte-11s23aw");
    			attr_dev(g, "transform", g_transform_value = "translate(" + /*$xScale*/ ctx[8](/*tick*/ ctx[19]) + "," + /*$yRange*/ ctx[10][0] + ")");
    			add_location(g, file$n, 52, 4, 1972);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, g, anchor);
    			if (if_block0) if_block0.m(g, null);
    			append_dev(g, if_block0_anchor);
    			if (if_block1) if_block1.m(g, null);
    			append_dev(g, text_1);
    			append_dev(text_1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (/*gridlines*/ ctx[0] !== false) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_2$1(ctx);
    					if_block0.c();
    					if_block0.m(g, if_block0_anchor);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*tickMarks*/ ctx[1] === true) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_1$7(ctx);
    					if_block1.c();
    					if_block1.m(g, text_1);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (dirty & /*formatTick, tickVals*/ 528 && t_value !== (t_value = /*formatTick*/ ctx[4](/*tick*/ ctx[19]) + "")) set_data_dev(t, t_value);

    			if (dirty & /*xTick, isBandwidth, $xScale*/ 416 && text_1_x_value !== (text_1_x_value = /*xTick*/ ctx[5] || /*isBandwidth*/ ctx[7]
    			? /*$xScale*/ ctx[8].bandwidth() / 2
    			: 0)) {
    				attr_dev(text_1, "x", text_1_x_value);
    			}

    			if (dirty & /*yTick*/ 64) {
    				attr_dev(text_1, "y", /*yTick*/ ctx[6]);
    			}

    			if (dirty & /*$xScale, tickVals, $yRange*/ 1792 && g_transform_value !== (g_transform_value = "translate(" + /*$xScale*/ ctx[8](/*tick*/ ctx[19]) + "," + /*$yRange*/ ctx[10][0] + ")")) {
    				attr_dev(g, "transform", g_transform_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(g);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$g.name,
    		type: "each",
    		source: "(52:2) {#each tickVals as tick, i}",
    		ctx
    	});

    	return block;
    }

    // (68:2) {#if baseline === true}
    function create_if_block$g(ctx) {
    	let line;
    	let line_y__value;
    	let line_y__value_1;

    	const block = {
    		c: function create() {
    			line = svg_element("line");
    			attr_dev(line, "class", "baseline svelte-11s23aw");
    			attr_dev(line, "y1", line_y__value = /*$height*/ ctx[11] + 0.5);
    			attr_dev(line, "y2", line_y__value_1 = /*$height*/ ctx[11] + 0.5);
    			attr_dev(line, "x1", "0");
    			attr_dev(line, "x2", /*$width*/ ctx[12]);
    			add_location(line, file$n, 68, 4, 2631);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, line, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$height*/ 2048 && line_y__value !== (line_y__value = /*$height*/ ctx[11] + 0.5)) {
    				attr_dev(line, "y1", line_y__value);
    			}

    			if (dirty & /*$height*/ 2048 && line_y__value_1 !== (line_y__value_1 = /*$height*/ ctx[11] + 0.5)) {
    				attr_dev(line, "y2", line_y__value_1);
    			}

    			if (dirty & /*$width*/ 4096) {
    				attr_dev(line, "x2", /*$width*/ ctx[12]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(line);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$g.name,
    		type: "if",
    		source: "(68:2) {#if baseline === true}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$o(ctx) {
    	let g;
    	let each_1_anchor;
    	let each_value = /*tickVals*/ ctx[9];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$g(get_each_context$g(ctx, each_value, i));
    	}

    	let if_block = /*baseline*/ ctx[2] === true && create_if_block$g(ctx);

    	const block = {
    		c: function create() {
    			g = svg_element("g");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    			if (if_block) if_block.c();
    			attr_dev(g, "class", "axis x-axis svelte-11s23aw");
    			toggle_class(g, "snapTicks", /*snapTicks*/ ctx[3]);
    			add_location(g, file$n, 50, 0, 1898);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, g, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(g, null);
    			}

    			append_dev(g, each_1_anchor);
    			if (if_block) if_block.m(g, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$xScale, tickVals, $yRange, xTick, isBandwidth, yTick, textAnchor, formatTick, tickMarks, $height, gridlines*/ 135155) {
    				each_value = /*tickVals*/ ctx[9];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$g(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$g(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(g, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (/*baseline*/ ctx[2] === true) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$g(ctx);
    					if_block.c();
    					if_block.m(g, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*snapTicks*/ 8) {
    				toggle_class(g, "snapTicks", /*snapTicks*/ ctx[3]);
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(g);
    			destroy_each(each_blocks, detaching);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$o.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$o($$self, $$props, $$invalidate) {
    	let isBandwidth;
    	let tickVals;
    	let $xScale;
    	let $yRange;
    	let $height;
    	let $width;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('AxisX', slots, []);
    	const { width, height, xScale, yRange } = getContext('LayerCake');
    	validate_store(width, 'width');
    	component_subscribe($$self, width, value => $$invalidate(12, $width = value));
    	validate_store(height, 'height');
    	component_subscribe($$self, height, value => $$invalidate(11, $height = value));
    	validate_store(xScale, 'xScale');
    	component_subscribe($$self, xScale, value => $$invalidate(8, $xScale = value));
    	validate_store(yRange, 'yRange');
    	component_subscribe($$self, yRange, value => $$invalidate(10, $yRange = value));
    	let { gridlines = true } = $$props;
    	let { tickMarks = false } = $$props;
    	let { baseline = false } = $$props;
    	let { snapTicks = false } = $$props;
    	let { formatTick = d => d } = $$props;
    	let { ticks = undefined } = $$props;
    	let { xTick = 0 } = $$props;
    	let { yTick = 16 } = $$props;

    	function textAnchor(i) {
    		if (snapTicks === true) {
    			if (i === 0) {
    				return 'start';
    			}

    			if (i === tickVals.length - 1) {
    				return 'end';
    			}
    		}

    		return 'middle';
    	}

    	const writable_props = [
    		'gridlines',
    		'tickMarks',
    		'baseline',
    		'snapTicks',
    		'formatTick',
    		'ticks',
    		'xTick',
    		'yTick'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<AxisX> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('gridlines' in $$props) $$invalidate(0, gridlines = $$props.gridlines);
    		if ('tickMarks' in $$props) $$invalidate(1, tickMarks = $$props.tickMarks);
    		if ('baseline' in $$props) $$invalidate(2, baseline = $$props.baseline);
    		if ('snapTicks' in $$props) $$invalidate(3, snapTicks = $$props.snapTicks);
    		if ('formatTick' in $$props) $$invalidate(4, formatTick = $$props.formatTick);
    		if ('ticks' in $$props) $$invalidate(18, ticks = $$props.ticks);
    		if ('xTick' in $$props) $$invalidate(5, xTick = $$props.xTick);
    		if ('yTick' in $$props) $$invalidate(6, yTick = $$props.yTick);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		width,
    		height,
    		xScale,
    		yRange,
    		gridlines,
    		tickMarks,
    		baseline,
    		snapTicks,
    		formatTick,
    		ticks,
    		xTick,
    		yTick,
    		textAnchor,
    		tickVals,
    		isBandwidth,
    		$xScale,
    		$yRange,
    		$height,
    		$width
    	});

    	$$self.$inject_state = $$props => {
    		if ('gridlines' in $$props) $$invalidate(0, gridlines = $$props.gridlines);
    		if ('tickMarks' in $$props) $$invalidate(1, tickMarks = $$props.tickMarks);
    		if ('baseline' in $$props) $$invalidate(2, baseline = $$props.baseline);
    		if ('snapTicks' in $$props) $$invalidate(3, snapTicks = $$props.snapTicks);
    		if ('formatTick' in $$props) $$invalidate(4, formatTick = $$props.formatTick);
    		if ('ticks' in $$props) $$invalidate(18, ticks = $$props.ticks);
    		if ('xTick' in $$props) $$invalidate(5, xTick = $$props.xTick);
    		if ('yTick' in $$props) $$invalidate(6, yTick = $$props.yTick);
    		if ('tickVals' in $$props) $$invalidate(9, tickVals = $$props.tickVals);
    		if ('isBandwidth' in $$props) $$invalidate(7, isBandwidth = $$props.isBandwidth);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$xScale*/ 256) {
    			$$invalidate(7, isBandwidth = typeof $xScale.bandwidth === 'function');
    		}

    		if ($$self.$$.dirty & /*ticks, isBandwidth, $xScale*/ 262528) {
    			$$invalidate(9, tickVals = Array.isArray(ticks)
    			? ticks
    			: isBandwidth
    				? $xScale.domain()
    				: typeof ticks === 'function'
    					? ticks($xScale.ticks())
    					: $xScale.ticks(ticks));
    		}
    	};

    	return [
    		gridlines,
    		tickMarks,
    		baseline,
    		snapTicks,
    		formatTick,
    		xTick,
    		yTick,
    		isBandwidth,
    		$xScale,
    		tickVals,
    		$yRange,
    		$height,
    		$width,
    		width,
    		height,
    		xScale,
    		yRange,
    		textAnchor,
    		ticks
    	];
    }

    class AxisX extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$o, create_fragment$o, safe_not_equal, {
    			gridlines: 0,
    			tickMarks: 1,
    			baseline: 2,
    			snapTicks: 3,
    			formatTick: 4,
    			ticks: 18,
    			xTick: 5,
    			yTick: 6
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AxisX",
    			options,
    			id: create_fragment$o.name
    		});
    	}

    	get gridlines() {
    		throw new Error("<AxisX>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set gridlines(value) {
    		throw new Error("<AxisX>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tickMarks() {
    		throw new Error("<AxisX>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tickMarks(value) {
    		throw new Error("<AxisX>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get baseline() {
    		throw new Error("<AxisX>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set baseline(value) {
    		throw new Error("<AxisX>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get snapTicks() {
    		throw new Error("<AxisX>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set snapTicks(value) {
    		throw new Error("<AxisX>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get formatTick() {
    		throw new Error("<AxisX>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set formatTick(value) {
    		throw new Error("<AxisX>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ticks() {
    		throw new Error("<AxisX>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ticks(value) {
    		throw new Error("<AxisX>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xTick() {
    		throw new Error("<AxisX>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xTick(value) {
    		throw new Error("<AxisX>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get yTick() {
    		throw new Error("<AxisX>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set yTick(value) {
    		throw new Error("<AxisX>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/graphs/atoms/AxisY.svelte generated by Svelte v3.49.0 */
    const file$m = "src/components/graphs/atoms/AxisY.svelte";

    function get_each_context$f(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[17] = list[i];
    	return child_ctx;
    }

    // (46:8) {#if gridlines !== false}
    function create_if_block_1$6(ctx) {
    	let line;
    	let line_y__value;
    	let line_y__value_1;

    	const block = {
    		c: function create() {
    			line = svg_element("line");
    			attr_dev(line, "class", "gridline svelte-sctg30");
    			attr_dev(line, "x2", "100%");

    			attr_dev(line, "y1", line_y__value = /*yTick*/ ctx[4] + (/*isBandwidth*/ ctx[8]
    			? /*$yScale*/ ctx[9].bandwidth() / 2
    			: 0));

    			attr_dev(line, "y2", line_y__value_1 = /*yTick*/ ctx[4] + (/*isBandwidth*/ ctx[8]
    			? /*$yScale*/ ctx[9].bandwidth() / 2
    			: 0));

    			add_location(line, file$m, 46, 10, 2358);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, line, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*yTick, isBandwidth, $yScale*/ 784 && line_y__value !== (line_y__value = /*yTick*/ ctx[4] + (/*isBandwidth*/ ctx[8]
    			? /*$yScale*/ ctx[9].bandwidth() / 2
    			: 0))) {
    				attr_dev(line, "y1", line_y__value);
    			}

    			if (dirty & /*yTick, isBandwidth, $yScale*/ 784 && line_y__value_1 !== (line_y__value_1 = /*yTick*/ ctx[4] + (/*isBandwidth*/ ctx[8]
    			? /*$yScale*/ ctx[9].bandwidth() / 2
    			: 0))) {
    				attr_dev(line, "y2", line_y__value_1);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(line);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$6.name,
    		type: "if",
    		source: "(46:8) {#if gridlines !== false}",
    		ctx
    	});

    	return block;
    }

    // (54:8) {#if tickMarks === true}
    function create_if_block$f(ctx) {
    	let line;
    	let line_x__value;
    	let line_y__value;
    	let line_y__value_1;

    	const block = {
    		c: function create() {
    			line = svg_element("line");
    			attr_dev(line, "class", "tick-mark svelte-sctg30");
    			attr_dev(line, "x1", "0");
    			attr_dev(line, "x2", line_x__value = /*isBandwidth*/ ctx[8] ? -6 : 6);

    			attr_dev(line, "y1", line_y__value = /*yTick*/ ctx[4] + (/*isBandwidth*/ ctx[8]
    			? /*$yScale*/ ctx[9].bandwidth() / 2
    			: 0));

    			attr_dev(line, "y2", line_y__value_1 = /*yTick*/ ctx[4] + (/*isBandwidth*/ ctx[8]
    			? /*$yScale*/ ctx[9].bandwidth() / 2
    			: 0));

    			add_location(line, file$m, 54, 10, 2633);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, line, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*isBandwidth*/ 256 && line_x__value !== (line_x__value = /*isBandwidth*/ ctx[8] ? -6 : 6)) {
    				attr_dev(line, "x2", line_x__value);
    			}

    			if (dirty & /*yTick, isBandwidth, $yScale*/ 784 && line_y__value !== (line_y__value = /*yTick*/ ctx[4] + (/*isBandwidth*/ ctx[8]
    			? /*$yScale*/ ctx[9].bandwidth() / 2
    			: 0))) {
    				attr_dev(line, "y1", line_y__value);
    			}

    			if (dirty & /*yTick, isBandwidth, $yScale*/ 784 && line_y__value_1 !== (line_y__value_1 = /*yTick*/ ctx[4] + (/*isBandwidth*/ ctx[8]
    			? /*$yScale*/ ctx[9].bandwidth() / 2
    			: 0))) {
    				attr_dev(line, "y2", line_y__value_1);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(line);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$f.name,
    		type: "if",
    		source: "(54:8) {#if tickMarks === true}",
    		ctx
    	});

    	return block;
    }

    // (44:4) {#each tickVals as tick}
    function create_each_block$f(ctx) {
    	let g;
    	let if_block0_anchor;
    	let text_1;
    	let t_value = /*formatTick*/ ctx[2](/*tick*/ ctx[17]) + "";
    	let t;
    	let text_1_y_value;
    	let text_1_dx_value;
    	let text_1_dy_value;
    	let g_class_value;
    	let g_transform_value;
    	let if_block0 = /*gridlines*/ ctx[0] !== false && create_if_block_1$6(ctx);
    	let if_block1 = /*tickMarks*/ ctx[1] === true && create_if_block$f(ctx);

    	const block = {
    		c: function create() {
    			g = svg_element("g");
    			if (if_block0) if_block0.c();
    			if_block0_anchor = empty();
    			if (if_block1) if_block1.c();
    			text_1 = svg_element("text");
    			t = text$1(t_value);
    			attr_dev(text_1, "x", /*xTick*/ ctx[3]);

    			attr_dev(text_1, "y", text_1_y_value = /*yTick*/ ctx[4] + (/*isBandwidth*/ ctx[8]
    			? /*$yScale*/ ctx[9].bandwidth() / 2
    			: 0));

    			attr_dev(text_1, "dx", text_1_dx_value = /*isBandwidth*/ ctx[8] ? -9 : /*dxTick*/ ctx[5]);
    			attr_dev(text_1, "dy", text_1_dy_value = /*isBandwidth*/ ctx[8] ? 4 : /*dyTick*/ ctx[6]);
    			set_style(text_1, "text-anchor", /*isBandwidth*/ ctx[8] ? 'end' : /*textAnchor*/ ctx[7]);
    			attr_dev(text_1, "class", "svelte-sctg30");
    			add_location(text_1, file$m, 62, 8, 2911);
    			attr_dev(g, "class", g_class_value = "tick tick-" + /*tick*/ ctx[17] + " svelte-sctg30");
    			attr_dev(g, "transform", g_transform_value = "translate(" + (/*$xRange*/ ctx[12][0] + (/*isBandwidth*/ ctx[8] ? /*$padding*/ ctx[11].left : 0)) + ", " + /*$yScale*/ ctx[9](/*tick*/ ctx[17]) + ")");
    			add_location(g, file$m, 44, 6, 2196);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, g, anchor);
    			if (if_block0) if_block0.m(g, null);
    			append_dev(g, if_block0_anchor);
    			if (if_block1) if_block1.m(g, null);
    			append_dev(g, text_1);
    			append_dev(text_1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (/*gridlines*/ ctx[0] !== false) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_1$6(ctx);
    					if_block0.c();
    					if_block0.m(g, if_block0_anchor);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*tickMarks*/ ctx[1] === true) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$f(ctx);
    					if_block1.c();
    					if_block1.m(g, text_1);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (dirty & /*formatTick, tickVals*/ 1028 && t_value !== (t_value = /*formatTick*/ ctx[2](/*tick*/ ctx[17]) + "")) set_data_dev(t, t_value);

    			if (dirty & /*xTick*/ 8) {
    				attr_dev(text_1, "x", /*xTick*/ ctx[3]);
    			}

    			if (dirty & /*yTick, isBandwidth, $yScale*/ 784 && text_1_y_value !== (text_1_y_value = /*yTick*/ ctx[4] + (/*isBandwidth*/ ctx[8]
    			? /*$yScale*/ ctx[9].bandwidth() / 2
    			: 0))) {
    				attr_dev(text_1, "y", text_1_y_value);
    			}

    			if (dirty & /*isBandwidth, dxTick*/ 288 && text_1_dx_value !== (text_1_dx_value = /*isBandwidth*/ ctx[8] ? -9 : /*dxTick*/ ctx[5])) {
    				attr_dev(text_1, "dx", text_1_dx_value);
    			}

    			if (dirty & /*isBandwidth, dyTick*/ 320 && text_1_dy_value !== (text_1_dy_value = /*isBandwidth*/ ctx[8] ? 4 : /*dyTick*/ ctx[6])) {
    				attr_dev(text_1, "dy", text_1_dy_value);
    			}

    			if (dirty & /*isBandwidth, textAnchor*/ 384) {
    				set_style(text_1, "text-anchor", /*isBandwidth*/ ctx[8] ? 'end' : /*textAnchor*/ ctx[7]);
    			}

    			if (dirty & /*tickVals*/ 1024 && g_class_value !== (g_class_value = "tick tick-" + /*tick*/ ctx[17] + " svelte-sctg30")) {
    				attr_dev(g, "class", g_class_value);
    			}

    			if (dirty & /*$xRange, isBandwidth, $padding, $yScale, tickVals*/ 7936 && g_transform_value !== (g_transform_value = "translate(" + (/*$xRange*/ ctx[12][0] + (/*isBandwidth*/ ctx[8] ? /*$padding*/ ctx[11].left : 0)) + ", " + /*$yScale*/ ctx[9](/*tick*/ ctx[17]) + ")")) {
    				attr_dev(g, "transform", g_transform_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(g);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$f.name,
    		type: "each",
    		source: "(44:4) {#each tickVals as tick}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$n(ctx) {
    	let g;
    	let g_transform_value;
    	let each_value = /*tickVals*/ ctx[10];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$f(get_each_context$f(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			g = svg_element("g");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(g, "class", "axis y-axis");
    			attr_dev(g, "transform", g_transform_value = "translate(" + -/*$padding*/ ctx[11].left + ", 0)");
    			add_location(g, file$m, 42, 2, 2094);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, g, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(g, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*tickVals, $xRange, isBandwidth, $padding, $yScale, xTick, yTick, dxTick, dyTick, textAnchor, formatTick, tickMarks, gridlines*/ 8191) {
    				each_value = /*tickVals*/ ctx[10];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$f(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$f(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(g, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*$padding*/ 2048 && g_transform_value !== (g_transform_value = "translate(" + -/*$padding*/ ctx[11].left + ", 0)")) {
    				attr_dev(g, "transform", g_transform_value);
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(g);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$n.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$n($$self, $$props, $$invalidate) {
    	let isBandwidth;
    	let tickVals;
    	let $yScale;
    	let $padding;
    	let $xRange;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('AxisY', slots, []);
    	const { padding, xRange, yScale } = getContext('LayerCake');
    	validate_store(padding, 'padding');
    	component_subscribe($$self, padding, value => $$invalidate(11, $padding = value));
    	validate_store(xRange, 'xRange');
    	component_subscribe($$self, xRange, value => $$invalidate(12, $xRange = value));
    	validate_store(yScale, 'yScale');
    	component_subscribe($$self, yScale, value => $$invalidate(9, $yScale = value));
    	let { gridlines = true } = $$props;
    	let { tickMarks = false } = $$props;
    	let { formatTick = d => d } = $$props;
    	let { ticks = 4 } = $$props;
    	let { xTick = 0 } = $$props;
    	let { yTick = 0 } = $$props;
    	let { dxTick = 0 } = $$props;
    	let { dyTick = -4 } = $$props;
    	let { textAnchor = 'start' } = $$props;

    	const writable_props = [
    		'gridlines',
    		'tickMarks',
    		'formatTick',
    		'ticks',
    		'xTick',
    		'yTick',
    		'dxTick',
    		'dyTick',
    		'textAnchor'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<AxisY> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('gridlines' in $$props) $$invalidate(0, gridlines = $$props.gridlines);
    		if ('tickMarks' in $$props) $$invalidate(1, tickMarks = $$props.tickMarks);
    		if ('formatTick' in $$props) $$invalidate(2, formatTick = $$props.formatTick);
    		if ('ticks' in $$props) $$invalidate(16, ticks = $$props.ticks);
    		if ('xTick' in $$props) $$invalidate(3, xTick = $$props.xTick);
    		if ('yTick' in $$props) $$invalidate(4, yTick = $$props.yTick);
    		if ('dxTick' in $$props) $$invalidate(5, dxTick = $$props.dxTick);
    		if ('dyTick' in $$props) $$invalidate(6, dyTick = $$props.dyTick);
    		if ('textAnchor' in $$props) $$invalidate(7, textAnchor = $$props.textAnchor);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		padding,
    		xRange,
    		yScale,
    		gridlines,
    		tickMarks,
    		formatTick,
    		ticks,
    		xTick,
    		yTick,
    		dxTick,
    		dyTick,
    		textAnchor,
    		isBandwidth,
    		tickVals,
    		$yScale,
    		$padding,
    		$xRange
    	});

    	$$self.$inject_state = $$props => {
    		if ('gridlines' in $$props) $$invalidate(0, gridlines = $$props.gridlines);
    		if ('tickMarks' in $$props) $$invalidate(1, tickMarks = $$props.tickMarks);
    		if ('formatTick' in $$props) $$invalidate(2, formatTick = $$props.formatTick);
    		if ('ticks' in $$props) $$invalidate(16, ticks = $$props.ticks);
    		if ('xTick' in $$props) $$invalidate(3, xTick = $$props.xTick);
    		if ('yTick' in $$props) $$invalidate(4, yTick = $$props.yTick);
    		if ('dxTick' in $$props) $$invalidate(5, dxTick = $$props.dxTick);
    		if ('dyTick' in $$props) $$invalidate(6, dyTick = $$props.dyTick);
    		if ('textAnchor' in $$props) $$invalidate(7, textAnchor = $$props.textAnchor);
    		if ('isBandwidth' in $$props) $$invalidate(8, isBandwidth = $$props.isBandwidth);
    		if ('tickVals' in $$props) $$invalidate(10, tickVals = $$props.tickVals);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$yScale*/ 512) {
    			$$invalidate(8, isBandwidth = typeof $yScale.bandwidth === 'function');
    		}

    		if ($$self.$$.dirty & /*ticks, isBandwidth, $yScale*/ 66304) {
    			$$invalidate(10, tickVals = Array.isArray(ticks)
    			? ticks
    			: isBandwidth
    				? $yScale.domain()
    				: typeof ticks === 'function'
    					? ticks($yScale.ticks())
    					: $yScale.ticks(ticks));
    		}
    	};

    	return [
    		gridlines,
    		tickMarks,
    		formatTick,
    		xTick,
    		yTick,
    		dxTick,
    		dyTick,
    		textAnchor,
    		isBandwidth,
    		$yScale,
    		tickVals,
    		$padding,
    		$xRange,
    		padding,
    		xRange,
    		yScale,
    		ticks
    	];
    }

    class AxisY extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$n, create_fragment$n, safe_not_equal, {
    			gridlines: 0,
    			tickMarks: 1,
    			formatTick: 2,
    			ticks: 16,
    			xTick: 3,
    			yTick: 4,
    			dxTick: 5,
    			dyTick: 6,
    			textAnchor: 7
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AxisY",
    			options,
    			id: create_fragment$n.name
    		});
    	}

    	get gridlines() {
    		throw new Error("<AxisY>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set gridlines(value) {
    		throw new Error("<AxisY>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tickMarks() {
    		throw new Error("<AxisY>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tickMarks(value) {
    		throw new Error("<AxisY>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get formatTick() {
    		throw new Error("<AxisY>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set formatTick(value) {
    		throw new Error("<AxisY>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ticks() {
    		throw new Error("<AxisY>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ticks(value) {
    		throw new Error("<AxisY>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xTick() {
    		throw new Error("<AxisY>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xTick(value) {
    		throw new Error("<AxisY>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get yTick() {
    		throw new Error("<AxisY>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set yTick(value) {
    		throw new Error("<AxisY>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dxTick() {
    		throw new Error("<AxisY>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dxTick(value) {
    		throw new Error("<AxisY>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dyTick() {
    		throw new Error("<AxisY>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dyTick(value) {
    		throw new Error("<AxisY>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get textAnchor() {
    		throw new Error("<AxisY>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set textAnchor(value) {
    		throw new Error("<AxisY>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/graphs/tooltips/QuadtreeTooltip.svelte generated by Svelte v3.49.0 */

    const { Object: Object_1$2 } = globals;
    const file$l = "src/components/graphs/tooltips/QuadtreeTooltip.svelte";

    const get_default_slot_changes = dirty => ({
    	x: dirty & /*xGetter, found*/ 10,
    	y: dirty & /*yGetter, found*/ 9,
    	found: dirty & /*found*/ 8,
    	visible: dirty & /*visible*/ 4,
    	e: dirty & /*e*/ 16
    });

    const get_default_slot_context = ctx => ({
    	x: /*xGetter*/ ctx[1](/*found*/ ctx[3]) || 0,
    	y: /*yGetter*/ ctx[0](/*found*/ ctx[3]) || 0,
    	found: /*found*/ ctx[3],
    	visible: /*visible*/ ctx[2],
    	e: /*e*/ ctx[4]
    });

    function create_fragment$m(ctx) {
    	let div;
    	let t;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[21].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[20], get_default_slot_context);

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = space();
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "bg svelte-6gdbom");
    			add_location(div, file$l, 58, 2, 2429);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			insert_dev(target, t, anchor);

    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div, "mousemove", /*findItem*/ ctx[10], false, false, false),
    					listen_dev(div, "mouseout", /*mouseout_handler*/ ctx[22], false, false, false),
    					listen_dev(div, "blur", /*blur_handler*/ ctx[23], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, xGetter, found, yGetter, visible, e*/ 1048607)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[20],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[20])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[20], dirty, get_default_slot_changes),
    						get_default_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$m($$self, $$props, $$invalidate) {
    	let xGetter;
    	let yGetter;
    	let finder;
    	let $data;
    	let $height;
    	let $width;
    	let $xGet;
    	let $yGet;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('QuadtreeTooltip', slots, ['default']);
    	const { data, xGet, yGet, width, height } = getContext('LayerCake');
    	validate_store(data, 'data');
    	component_subscribe($$self, data, value => $$invalidate(15, $data = value));
    	validate_store(xGet, 'xGet');
    	component_subscribe($$self, xGet, value => $$invalidate(18, $xGet = value));
    	validate_store(yGet, 'yGet');
    	component_subscribe($$self, yGet, value => $$invalidate(19, $yGet = value));
    	validate_store(width, 'width');
    	component_subscribe($$self, width, value => $$invalidate(17, $width = value));
    	validate_store(height, 'height');
    	component_subscribe($$self, height, value => $$invalidate(16, $height = value));
    	let visible = false;
    	let found = {};
    	let e = {};
    	let { x = 'x' } = $$props;
    	let { y = 'y' } = $$props;
    	let { searchRadius = undefined } = $$props;
    	let { dataset = undefined } = $$props;

    	function findItem(evt) {
    		$$invalidate(4, e = evt);
    		const xLayerKey = `layer${x.toUpperCase()}`;
    		const yLayerKey = `layer${y.toUpperCase()}`;
    		$$invalidate(3, found = finder.find(evt[xLayerKey], evt[yLayerKey], searchRadius) || {});
    		$$invalidate(2, visible = Object.keys(found).length > 0);
    	}

    	const writable_props = ['x', 'y', 'searchRadius', 'dataset'];

    	Object_1$2.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<QuadtreeTooltip> was created with unknown prop '${key}'`);
    	});

    	const mouseout_handler = () => {
    		$$invalidate(2, visible = false);
    		$$invalidate(3, found = {});
    	};

    	const blur_handler = () => {
    		$$invalidate(2, visible = false);
    		$$invalidate(3, found = {});
    	};

    	$$self.$$set = $$props => {
    		if ('x' in $$props) $$invalidate(11, x = $$props.x);
    		if ('y' in $$props) $$invalidate(12, y = $$props.y);
    		if ('searchRadius' in $$props) $$invalidate(13, searchRadius = $$props.searchRadius);
    		if ('dataset' in $$props) $$invalidate(14, dataset = $$props.dataset);
    		if ('$$scope' in $$props) $$invalidate(20, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		quadtree,
    		data,
    		xGet,
    		yGet,
    		width,
    		height,
    		visible,
    		found,
    		e,
    		x,
    		y,
    		searchRadius,
    		dataset,
    		findItem,
    		yGetter,
    		xGetter,
    		finder,
    		$data,
    		$height,
    		$width,
    		$xGet,
    		$yGet
    	});

    	$$self.$inject_state = $$props => {
    		if ('visible' in $$props) $$invalidate(2, visible = $$props.visible);
    		if ('found' in $$props) $$invalidate(3, found = $$props.found);
    		if ('e' in $$props) $$invalidate(4, e = $$props.e);
    		if ('x' in $$props) $$invalidate(11, x = $$props.x);
    		if ('y' in $$props) $$invalidate(12, y = $$props.y);
    		if ('searchRadius' in $$props) $$invalidate(13, searchRadius = $$props.searchRadius);
    		if ('dataset' in $$props) $$invalidate(14, dataset = $$props.dataset);
    		if ('yGetter' in $$props) $$invalidate(0, yGetter = $$props.yGetter);
    		if ('xGetter' in $$props) $$invalidate(1, xGetter = $$props.xGetter);
    		if ('finder' in $$props) finder = $$props.finder;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*x, $xGet, $yGet*/ 788480) {
    			$$invalidate(1, xGetter = x === 'x' ? $xGet : $yGet);
    		}

    		if ($$self.$$.dirty & /*y, $yGet, $xGet*/ 790528) {
    			$$invalidate(0, yGetter = y === 'y' ? $yGet : $xGet);
    		}

    		if ($$self.$$.dirty & /*$width, $height, xGetter, yGetter, dataset, $data*/ 245763) {
    			finder = quadtree().extent([[-1, -1], [$width + 1, $height + 1]]).x(xGetter).y(yGetter).addAll(dataset || $data);
    		}
    	};

    	return [
    		yGetter,
    		xGetter,
    		visible,
    		found,
    		e,
    		data,
    		xGet,
    		yGet,
    		width,
    		height,
    		findItem,
    		x,
    		y,
    		searchRadius,
    		dataset,
    		$data,
    		$height,
    		$width,
    		$xGet,
    		$yGet,
    		$$scope,
    		slots,
    		mouseout_handler,
    		blur_handler
    	];
    }

    class QuadtreeTooltip extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$m, create_fragment$m, safe_not_equal, {
    			x: 11,
    			y: 12,
    			searchRadius: 13,
    			dataset: 14
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "QuadtreeTooltip",
    			options,
    			id: create_fragment$m.name
    		});
    	}

    	get x() {
    		throw new Error("<QuadtreeTooltip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set x(value) {
    		throw new Error("<QuadtreeTooltip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get y() {
    		throw new Error("<QuadtreeTooltip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set y(value) {
    		throw new Error("<QuadtreeTooltip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get searchRadius() {
    		throw new Error("<QuadtreeTooltip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set searchRadius(value) {
    		throw new Error("<QuadtreeTooltip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dataset() {
    		throw new Error("<QuadtreeTooltip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dataset(value) {
    		throw new Error("<QuadtreeTooltip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/graphs/tooltips/SharedTooltip.svelte generated by Svelte v3.49.0 */

    const { Object: Object_1$1 } = globals;
    const file$k = "src/components/graphs/tooltips/SharedTooltip.svelte";

    function get_context$3(ctx) {
    	const constants_0 = /*sortResult*/ ctx[11](/*found*/ ctx[21]);
    	ctx[23] = constants_0;
    }

    function get_each_context$e(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[24] = list[i];
    	return child_ctx;
    }

    // (107:4) {#if visible === true}
    function create_if_block$e(ctx) {
    	let div0;
    	let t0;
    	let div2;
    	let div1;
    	let t1_value = /*formatTitle*/ ctx[0](/*found*/ ctx[21][/*$config*/ ctx[4].x]) + "";
    	let t1;
    	let t2;
    	let each_value = /*tooltipData*/ ctx[23];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$e(get_each_context$e(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t0 = space();
    			div2 = element("div");
    			div1 = element("div");
    			t1 = text$1(t1_value);
    			t2 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			set_style(div0, "left", /*x*/ ctx[12] + "px");
    			attr_dev(div0, "class", "line svelte-zx4q6d");
    			add_location(div0, file$k, 107, 6, 3268);
    			attr_dev(div1, "class", "title svelte-zx4q6d");
    			add_location(div1, file$k, 118, 10, 3541);
    			attr_dev(div2, "class", "tooltip svelte-zx4q6d");
    			set_style(div2, "width", w$1 + "px");
    			set_style(div2, "display", /*visible*/ ctx[20] ? 'block' : 'none');
    			set_style(div2, "left", Math.min(Math.max(/*w2*/ ctx[10], /*x*/ ctx[12]), /*$width*/ ctx[6] - /*w2*/ ctx[10]) + "px");
    			add_location(div2, file$k, 111, 6, 3342);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, t1);
    			append_dev(div2, t2);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div2, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*x*/ 4096) {
    				set_style(div0, "left", /*x*/ ctx[12] + "px");
    			}

    			if (dirty & /*formatTitle, found, $config*/ 2097169 && t1_value !== (t1_value = /*formatTitle*/ ctx[0](/*found*/ ctx[21][/*$config*/ ctx[4].x]) + "")) set_data_dev(t1, t1_value);

    			if (dirty & /*formatValue, sortResult, found, colorMap, formatKey*/ 2099206) {
    				each_value = /*tooltipData*/ ctx[23];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$e(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$e(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div2, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*visible*/ 1048576) {
    				set_style(div2, "display", /*visible*/ ctx[20] ? 'block' : 'none');
    			}

    			if (dirty & /*x, $width*/ 4160) {
    				set_style(div2, "left", Math.min(Math.max(/*w2*/ ctx[10], /*x*/ ctx[12]), /*$width*/ ctx[6] - /*w2*/ ctx[10]) + "px");
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div2);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$e.name,
    		type: "if",
    		source: "(107:4) {#if visible === true}",
    		ctx
    	});

    	return block;
    }

    // (120:10) {#each tooltipData as row}
    function create_each_block$e(ctx) {
    	let div;
    	let span;
    	let t0_value = /*formatKey*/ ctx[2](/*row*/ ctx[24].label) + "";
    	let t0;
    	let t1;
    	let t2;
    	let t3_value = /*formatValue*/ ctx[1](/*row*/ ctx[24].value) + "";
    	let t3;
    	let t4;

    	const block = {
    		c: function create() {
    			div = element("div");
    			span = element("span");
    			t0 = text$1(t0_value);
    			t1 = text$1(":");
    			t2 = space();
    			t3 = text$1(t3_value);
    			t4 = space();
    			attr_dev(span, "class", "key svelte-zx4q6d");
    			set_style(span, "--color", colorMap.get(/*row*/ ctx[24].label));
    			add_location(span, file$k, 121, 14, 3679);
    			attr_dev(div, "class", "row");
    			add_location(div, file$k, 120, 12, 3647);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span);
    			append_dev(span, t0);
    			append_dev(span, t1);
    			append_dev(div, t2);
    			append_dev(div, t3);
    			append_dev(div, t4);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*formatKey, found*/ 2097156 && t0_value !== (t0_value = /*formatKey*/ ctx[2](/*row*/ ctx[24].label) + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*found*/ 2097152) {
    				set_style(span, "--color", colorMap.get(/*row*/ ctx[24].label));
    			}

    			if (dirty & /*formatValue, found*/ 2097154 && t3_value !== (t3_value = /*formatValue*/ ctx[1](/*row*/ ctx[24].value) + "")) set_data_dev(t3, t3_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$e.name,
    		type: "each",
    		source: "(120:10) {#each tooltipData as row}",
    		ctx
    	});

    	return block;
    }

    // (97:2) <QuadTree     dataset={dataset || $data}     y='x'     let:x     let:y     let:visible     let:found     let:e   >
    function create_default_slot$6(ctx) {
    	get_context$3(ctx);
    	let if_block_anchor;
    	let if_block = /*visible*/ ctx[20] === true && create_if_block$e(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			get_context$3(ctx);

    			if (/*visible*/ ctx[20] === true) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$e(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$6.name,
    		type: "slot",
    		source: "(97:2) <QuadTree     dataset={dataset || $data}     y='x'     let:x     let:y     let:visible     let:found     let:e   >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$l(ctx) {
    	let quadtree;
    	let current;

    	quadtree = new QuadtreeTooltip({
    			props: {
    				dataset: /*dataset*/ ctx[3] || /*$data*/ ctx[5],
    				y: "x",
    				$$slots: {
    					default: [
    						create_default_slot$6,
    						({ x, y, visible, found, e }) => ({
    							12: x,
    							19: y,
    							20: visible,
    							21: found,
    							22: e
    						}),
    						({ x, y, visible, found, e }) => (x ? 4096 : 0) | (y ? 524288 : 0) | (visible ? 1048576 : 0) | (found ? 2097152 : 0) | (e ? 4194304 : 0)
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(quadtree.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(quadtree, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const quadtree_changes = {};
    			if (dirty & /*dataset, $data*/ 40) quadtree_changes.dataset = /*dataset*/ ctx[3] || /*$data*/ ctx[5];

    			if (dirty & /*$$scope, visible, x, $width, found, formatValue, formatKey, formatTitle, $config*/ 137367639) {
    				quadtree_changes.$$scope = { dirty, ctx };
    			}

    			quadtree.$set(quadtree_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(quadtree.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(quadtree.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(quadtree, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const w$1 = 150;

    function instance$l($$self, $$props, $$invalidate) {
    	let dataMap;
    	let $config;
    	let $x;
    	let $data;
    	let $width;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SharedTooltip', slots, []);
    	const { data, width, yScale, config, x } = getContext('LayerCake');
    	validate_store(data, 'data');
    	component_subscribe($$self, data, value => $$invalidate(5, $data = value));
    	validate_store(width, 'width');
    	component_subscribe($$self, width, value => $$invalidate(6, $width = value));
    	validate_store(config, 'config');
    	component_subscribe($$self, config, value => $$invalidate(4, $config = value));
    	validate_store(x, 'x');
    	component_subscribe($$self, x, value => $$invalidate(14, $x = value));
    	const commas = format(',');
    	const titleCase = d => d.replace(/^\w/, w => w.toUpperCase());
    	let { formatTitle = d => d } = $$props;
    	let { formatValue = d => isNaN(+d) ? d : commas(d) } = $$props;
    	let { formatKey = d => titleCase(d) } = $$props;
    	let { offset = -20 } = $$props;
    	let { dataset = undefined } = $$props;
    	const w2 = w$1 / 2;

    	/* --------------------------------------------
     * Sort the keys by the highest value
     */
    	function sortResult(result) {
    		if (result && Object.keys(result).length) {
    			const allRows = dataMap.get(result[$config.x]);
    			return allRows.map(d => ({ label: d[$config.z], value: d[$config.y] })).sort((a, b) => b.value - a.value);
    		}

    		return [];
    	} // if (Object.keys(result).length === 0) return [];
    	// const rows = Object.keys(result).filter(d => d !== $config.x).map(key => {

    	const writable_props = ['formatTitle', 'formatValue', 'formatKey', 'offset', 'dataset'];

    	Object_1$1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SharedTooltip> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('formatTitle' in $$props) $$invalidate(0, formatTitle = $$props.formatTitle);
    		if ('formatValue' in $$props) $$invalidate(1, formatValue = $$props.formatValue);
    		if ('formatKey' in $$props) $$invalidate(2, formatKey = $$props.formatKey);
    		if ('offset' in $$props) $$invalidate(13, offset = $$props.offset);
    		if ('dataset' in $$props) $$invalidate(3, dataset = $$props.dataset);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		format,
    		group,
    		QuadTree: QuadtreeTooltip,
    		colorMap,
    		data,
    		width,
    		yScale,
    		config,
    		x,
    		commas,
    		titleCase,
    		formatTitle,
    		formatValue,
    		formatKey,
    		offset,
    		dataset,
    		w: w$1,
    		w2,
    		sortResult,
    		dataMap,
    		$config,
    		$x,
    		$data,
    		$width
    	});

    	$$self.$inject_state = $$props => {
    		if ('formatTitle' in $$props) $$invalidate(0, formatTitle = $$props.formatTitle);
    		if ('formatValue' in $$props) $$invalidate(1, formatValue = $$props.formatValue);
    		if ('formatKey' in $$props) $$invalidate(2, formatKey = $$props.formatKey);
    		if ('offset' in $$props) $$invalidate(13, offset = $$props.offset);
    		if ('dataset' in $$props) $$invalidate(3, dataset = $$props.dataset);
    		if ('dataMap' in $$props) dataMap = $$props.dataMap;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*dataset, $x*/ 16392) {
    			dataMap = group(dataset, $x);
    		}
    	};

    	return [
    		formatTitle,
    		formatValue,
    		formatKey,
    		dataset,
    		$config,
    		$data,
    		$width,
    		data,
    		width,
    		config,
    		w2,
    		sortResult,
    		x,
    		offset,
    		$x
    	];
    }

    class SharedTooltip extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$l, create_fragment$l, safe_not_equal, {
    			formatTitle: 0,
    			formatValue: 1,
    			formatKey: 2,
    			offset: 13,
    			dataset: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SharedTooltip",
    			options,
    			id: create_fragment$l.name
    		});
    	}

    	get formatTitle() {
    		throw new Error("<SharedTooltip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set formatTitle(value) {
    		throw new Error("<SharedTooltip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get formatValue() {
    		throw new Error("<SharedTooltip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set formatValue(value) {
    		throw new Error("<SharedTooltip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get formatKey() {
    		throw new Error("<SharedTooltip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set formatKey(value) {
    		throw new Error("<SharedTooltip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get offset() {
    		throw new Error("<SharedTooltip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set offset(value) {
    		throw new Error("<SharedTooltip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dataset() {
    		throw new Error("<SharedTooltip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dataset(value) {
    		throw new Error("<SharedTooltip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/graphs/atoms/Caption.svelte generated by Svelte v3.49.0 */

    const file$j = "src/components/graphs/atoms/Caption.svelte";

    function create_fragment$k(ctx) {
    	let div;
    	let span;
    	let t0;
    	let t1;
    	let a;
    	let t2;
    	let svg;
    	let path;
    	let polyline;
    	let line;
    	let div_class_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			span = element("span");
    			t0 = text$1(/*caption*/ ctx[0]);
    			t1 = space();
    			a = element("a");
    			t2 = text$1("Download data ");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			polyline = svg_element("polyline");
    			line = svg_element("line");
    			attr_dev(span, "class", "caption-text svelte-1m1lkwz");
    			add_location(span, file$j, 6, 4, 123);
    			attr_dev(path, "d", "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4");
    			add_location(path, file$j, 8, 236, 457);
    			attr_dev(polyline, "points", "7 10 12 15 17 10");
    			add_location(polyline, file$j, 8, 295, 516);
    			attr_dev(line, "x1", "12");
    			attr_dev(line, "y1", "15");
    			attr_dev(line, "x2", "12");
    			attr_dev(line, "y2", "3");
    			add_location(line, file$j, 8, 342, 563);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "24");
    			attr_dev(svg, "height", "24");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "stroke", "currentColor");
    			attr_dev(svg, "stroke-width", "2");
    			attr_dev(svg, "stroke-linecap", "round");
    			attr_dev(svg, "stroke-linejoin", "round");
    			attr_dev(svg, "class", "feather feather-download svelte-1m1lkwz");
    			add_location(svg, file$j, 8, 22, 243);
    			attr_dev(a, "class", "download-button svelte-1m1lkwz");
    			attr_dev(a, "href", /*url*/ ctx[1]);
    			attr_dev(a, "download", "");
    			add_location(a, file$j, 7, 4, 173);
    			attr_dev(div, "class", div_class_value = "caption caption-" + /*type*/ ctx[2] + " svelte-1m1lkwz");
    			add_location(div, file$j, 5, 0, 82);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span);
    			append_dev(span, t0);
    			append_dev(div, t1);
    			append_dev(div, a);
    			append_dev(a, t2);
    			append_dev(a, svg);
    			append_dev(svg, path);
    			append_dev(svg, polyline);
    			append_dev(svg, line);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*caption*/ 1) set_data_dev(t0, /*caption*/ ctx[0]);

    			if (dirty & /*url*/ 2) {
    				attr_dev(a, "href", /*url*/ ctx[1]);
    			}

    			if (dirty & /*type*/ 4 && div_class_value !== (div_class_value = "caption caption-" + /*type*/ ctx[2] + " svelte-1m1lkwz")) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$k($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Caption', slots, []);
    	let { caption } = $$props;
    	let { url } = $$props;
    	let { type } = $$props;
    	const writable_props = ['caption', 'url', 'type'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Caption> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('caption' in $$props) $$invalidate(0, caption = $$props.caption);
    		if ('url' in $$props) $$invalidate(1, url = $$props.url);
    		if ('type' in $$props) $$invalidate(2, type = $$props.type);
    	};

    	$$self.$capture_state = () => ({ caption, url, type });

    	$$self.$inject_state = $$props => {
    		if ('caption' in $$props) $$invalidate(0, caption = $$props.caption);
    		if ('url' in $$props) $$invalidate(1, url = $$props.url);
    		if ('type' in $$props) $$invalidate(2, type = $$props.type);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [caption, url, type];
    }

    class Caption extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$k, create_fragment$k, safe_not_equal, { caption: 0, url: 1, type: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Caption",
    			options,
    			id: create_fragment$k.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*caption*/ ctx[0] === undefined && !('caption' in props)) {
    			console.warn("<Caption> was created without expected prop 'caption'");
    		}

    		if (/*url*/ ctx[1] === undefined && !('url' in props)) {
    			console.warn("<Caption> was created without expected prop 'url'");
    		}

    		if (/*type*/ ctx[2] === undefined && !('type' in props)) {
    			console.warn("<Caption> was created without expected prop 'type'");
    		}
    	}

    	get caption() {
    		throw new Error("<Caption>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set caption(value) {
    		throw new Error("<Caption>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get url() {
    		throw new Error("<Caption>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set url(value) {
    		throw new Error("<Caption>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get type() {
    		throw new Error("<Caption>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<Caption>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/graphs/LineChart.svelte generated by Svelte v3.49.0 */
    const file$i = "src/components/graphs/LineChart.svelte";

    // (42:2) <Svg>
    function create_default_slot_2$4(ctx) {
    	let axisx;
    	let t0;
    	let axisy;
    	let t1;
    	let multiline;
    	let current;

    	axisx = new AxisX({
    			props: {
    				gridlines: false,
    				ticks: 3,
    				formatTick: /*formatTickX*/ ctx[9],
    				snapTicks: false,
    				tickMarks: false
    			},
    			$$inline: true
    		});

    	axisy = new AxisY({
    			props: {
    				ticks: 4,
    				formatTick: /*formatTickY*/ ctx[10]
    			},
    			$$inline: true
    		});

    	multiline = new Multiline({
    			props: { activeChart: /*activeChart*/ ctx[1] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(axisx.$$.fragment);
    			t0 = space();
    			create_component(axisy.$$.fragment);
    			t1 = space();
    			create_component(multiline.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(axisx, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(axisy, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(multiline, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const axisx_changes = {};
    			if (dirty & /*formatTickX*/ 512) axisx_changes.formatTick = /*formatTickX*/ ctx[9];
    			axisx.$set(axisx_changes);
    			const axisy_changes = {};
    			if (dirty & /*formatTickY*/ 1024) axisy_changes.formatTick = /*formatTickY*/ ctx[10];
    			axisy.$set(axisy_changes);
    			const multiline_changes = {};
    			if (dirty & /*activeChart*/ 2) multiline_changes.activeChart = /*activeChart*/ ctx[1];
    			multiline.$set(multiline_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(axisx.$$.fragment, local);
    			transition_in(axisy.$$.fragment, local);
    			transition_in(multiline.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(axisx.$$.fragment, local);
    			transition_out(axisy.$$.fragment, local);
    			transition_out(multiline.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(axisx, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(axisy, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(multiline, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$4.name,
    		type: "slot",
    		source: "(42:2) <Svg>",
    		ctx
    	});

    	return block;
    }

    // (57:2) <Html>
    function create_default_slot_1$4(ctx) {
    	let sharedtooltip;
    	let current;

    	sharedtooltip = new SharedTooltip({
    			props: {
    				dataset: /*data*/ ctx[2],
    				formatTitle: /*formatTickX*/ ctx[9],
    				formatKey: /*func*/ ctx[15],
    				formatValue: /*formatTickY*/ ctx[10]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(sharedtooltip.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(sharedtooltip, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const sharedtooltip_changes = {};
    			if (dirty & /*data*/ 4) sharedtooltip_changes.dataset = /*data*/ ctx[2];
    			if (dirty & /*formatTickX*/ 512) sharedtooltip_changes.formatTitle = /*formatTickX*/ ctx[9];
    			if (dirty & /*formatTickY*/ 1024) sharedtooltip_changes.formatValue = /*formatTickY*/ ctx[10];
    			sharedtooltip.$set(sharedtooltip_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sharedtooltip.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sharedtooltip.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(sharedtooltip, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$4.name,
    		type: "slot",
    		source: "(57:2) <Html>",
    		ctx
    	});

    	return block;
    }

    // (28:1) <LayerCake   padding={{ top: 20, right: 10, bottom: 20, left: 45 }}   flatData = { data }   data = { groupedData }   x={ xKey }   xScale={ xKey === 'date' ? scaleTime() : scaleLinear() }   y={ yKey }   { yDomain }   yNice={ true }   z={ zKey }   zScale={ scaleOrdinal() }   zDomain={ seriesNames }   zRange={ seriesColors }  >
    function create_default_slot$5(ctx) {
    	let svg;
    	let t;
    	let html;
    	let current;

    	svg = new Svg({
    			props: {
    				$$slots: { default: [create_default_slot_2$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	html = new Html({
    			props: {
    				$$slots: { default: [create_default_slot_1$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(svg.$$.fragment);
    			t = space();
    			create_component(html.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(svg, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(html, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const svg_changes = {};

    			if (dirty & /*$$scope, activeChart, formatTickY, formatTickX*/ 67074) {
    				svg_changes.$$scope = { dirty, ctx };
    			}

    			svg.$set(svg_changes);
    			const html_changes = {};

    			if (dirty & /*$$scope, data, formatTickX, formatTickY*/ 67076) {
    				html_changes.$$scope = { dirty, ctx };
    			}

    			html.$set(html_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(svg.$$.fragment, local);
    			transition_in(html.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(svg.$$.fragment, local);
    			transition_out(html.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(svg, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(html, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$5.name,
    		type: "slot",
    		source: "(28:1) <LayerCake   padding={{ top: 20, right: 10, bottom: 20, left: 45 }}   flatData = { data }   data = { groupedData }   x={ xKey }   xScale={ xKey === 'date' ? scaleTime() : scaleLinear() }   y={ yKey }   { yDomain }   yNice={ true }   z={ zKey }   zScale={ scaleOrdinal() }   zDomain={ seriesNames }   zRange={ seriesColors }  >",
    		ctx
    	});

    	return block;
    }

    // (67:0) {#if includeCaption}
    function create_if_block$d(ctx) {
    	let caption_1;
    	let current;

    	caption_1 = new Caption({
    			props: {
    				caption: /*caption*/ ctx[0],
    				url: /*url*/ ctx[3],
    				type: /*spanCol*/ ctx[12] === 12
    				? 'split-cols'
    				: 'single-cols'
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(caption_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(caption_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const caption_1_changes = {};
    			if (dirty & /*caption*/ 1) caption_1_changes.caption = /*caption*/ ctx[0];
    			if (dirty & /*url*/ 8) caption_1_changes.url = /*url*/ ctx[3];

    			if (dirty & /*spanCol*/ 4096) caption_1_changes.type = /*spanCol*/ ctx[12] === 12
    			? 'split-cols'
    			: 'single-cols';

    			caption_1.$set(caption_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(caption_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(caption_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(caption_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$d.name,
    		type: "if",
    		source: "(67:0) {#if includeCaption}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$j(ctx) {
    	let div;
    	let layercake;
    	let t;
    	let if_block_anchor;
    	let current;

    	layercake = new LayerCake({
    			props: {
    				padding: { top: 20, right: 10, bottom: 20, left: 45 },
    				flatData: /*data*/ ctx[2],
    				data: /*groupedData*/ ctx[4],
    				x: /*xKey*/ ctx[5],
    				xScale: /*xKey*/ ctx[5] === 'date' ? time() : linear(),
    				y: /*yKey*/ ctx[6],
    				yDomain: /*yDomain*/ ctx[8],
    				yNice: true,
    				z: /*zKey*/ ctx[7],
    				zScale: ordinal(),
    				zDomain: /*seriesNames*/ ctx[13],
    				zRange: /*seriesColors*/ ctx[14],
    				$$slots: { default: [create_default_slot$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let if_block = /*includeCaption*/ ctx[11] && create_if_block$d(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(layercake.$$.fragment);
    			t = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			attr_dev(div, "class", "chart line-chart");
    			add_location(div, file$i, 26, 0, 890);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(layercake, div, null);
    			insert_dev(target, t, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const layercake_changes = {};
    			if (dirty & /*data*/ 4) layercake_changes.flatData = /*data*/ ctx[2];
    			if (dirty & /*groupedData*/ 16) layercake_changes.data = /*groupedData*/ ctx[4];
    			if (dirty & /*xKey*/ 32) layercake_changes.x = /*xKey*/ ctx[5];
    			if (dirty & /*xKey*/ 32) layercake_changes.xScale = /*xKey*/ ctx[5] === 'date' ? time() : linear();
    			if (dirty & /*yKey*/ 64) layercake_changes.y = /*yKey*/ ctx[6];
    			if (dirty & /*yDomain*/ 256) layercake_changes.yDomain = /*yDomain*/ ctx[8];
    			if (dirty & /*zKey*/ 128) layercake_changes.z = /*zKey*/ ctx[7];

    			if (dirty & /*$$scope, data, formatTickX, formatTickY, activeChart*/ 67078) {
    				layercake_changes.$$scope = { dirty, ctx };
    			}

    			layercake.$set(layercake_changes);

    			if (/*includeCaption*/ ctx[11]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*includeCaption*/ 2048) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$d(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(layercake.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(layercake.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(layercake);
    			if (detaching) detach_dev(t);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('LineChart', slots, []);
    	let { caption } = $$props;
    	let { activeChart } = $$props;
    	let { data } = $$props;
    	let { url } = $$props;
    	let { groupedData } = $$props;
    	let { xKey } = $$props;
    	let { yKey } = $$props;
    	let { zKey } = $$props;
    	let { yDomain = [0, null] } = $$props;
    	let { formatTickX } = $$props;
    	let { formatTickY = d => d.toFixed(0) } = $$props;
    	let { includeCaption = true } = $$props;
    	let { spanCol } = $$props;
    	let seriesNames = Array.from(colorMap).map(d => d[0]);
    	let seriesColors = Array.from(colorMap).map(d => d[1]);

    	const writable_props = [
    		'caption',
    		'activeChart',
    		'data',
    		'url',
    		'groupedData',
    		'xKey',
    		'yKey',
    		'zKey',
    		'yDomain',
    		'formatTickX',
    		'formatTickY',
    		'includeCaption',
    		'spanCol'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<LineChart> was created with unknown prop '${key}'`);
    	});

    	const func = d => labelMap.get(d);

    	$$self.$$set = $$props => {
    		if ('caption' in $$props) $$invalidate(0, caption = $$props.caption);
    		if ('activeChart' in $$props) $$invalidate(1, activeChart = $$props.activeChart);
    		if ('data' in $$props) $$invalidate(2, data = $$props.data);
    		if ('url' in $$props) $$invalidate(3, url = $$props.url);
    		if ('groupedData' in $$props) $$invalidate(4, groupedData = $$props.groupedData);
    		if ('xKey' in $$props) $$invalidate(5, xKey = $$props.xKey);
    		if ('yKey' in $$props) $$invalidate(6, yKey = $$props.yKey);
    		if ('zKey' in $$props) $$invalidate(7, zKey = $$props.zKey);
    		if ('yDomain' in $$props) $$invalidate(8, yDomain = $$props.yDomain);
    		if ('formatTickX' in $$props) $$invalidate(9, formatTickX = $$props.formatTickX);
    		if ('formatTickY' in $$props) $$invalidate(10, formatTickY = $$props.formatTickY);
    		if ('includeCaption' in $$props) $$invalidate(11, includeCaption = $$props.includeCaption);
    		if ('spanCol' in $$props) $$invalidate(12, spanCol = $$props.spanCol);
    	};

    	$$self.$capture_state = () => ({
    		Html,
    		LayerCake,
    		Svg,
    		scaleOrdinal: ordinal,
    		scaleTime: time,
    		scaleLinear: linear,
    		Multiline,
    		AxisX,
    		AxisY,
    		SharedTooltip,
    		Caption,
    		colorMap,
    		labelMap,
    		caption,
    		activeChart,
    		data,
    		url,
    		groupedData,
    		xKey,
    		yKey,
    		zKey,
    		yDomain,
    		formatTickX,
    		formatTickY,
    		includeCaption,
    		spanCol,
    		seriesNames,
    		seriesColors
    	});

    	$$self.$inject_state = $$props => {
    		if ('caption' in $$props) $$invalidate(0, caption = $$props.caption);
    		if ('activeChart' in $$props) $$invalidate(1, activeChart = $$props.activeChart);
    		if ('data' in $$props) $$invalidate(2, data = $$props.data);
    		if ('url' in $$props) $$invalidate(3, url = $$props.url);
    		if ('groupedData' in $$props) $$invalidate(4, groupedData = $$props.groupedData);
    		if ('xKey' in $$props) $$invalidate(5, xKey = $$props.xKey);
    		if ('yKey' in $$props) $$invalidate(6, yKey = $$props.yKey);
    		if ('zKey' in $$props) $$invalidate(7, zKey = $$props.zKey);
    		if ('yDomain' in $$props) $$invalidate(8, yDomain = $$props.yDomain);
    		if ('formatTickX' in $$props) $$invalidate(9, formatTickX = $$props.formatTickX);
    		if ('formatTickY' in $$props) $$invalidate(10, formatTickY = $$props.formatTickY);
    		if ('includeCaption' in $$props) $$invalidate(11, includeCaption = $$props.includeCaption);
    		if ('spanCol' in $$props) $$invalidate(12, spanCol = $$props.spanCol);
    		if ('seriesNames' in $$props) $$invalidate(13, seriesNames = $$props.seriesNames);
    		if ('seriesColors' in $$props) $$invalidate(14, seriesColors = $$props.seriesColors);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		caption,
    		activeChart,
    		data,
    		url,
    		groupedData,
    		xKey,
    		yKey,
    		zKey,
    		yDomain,
    		formatTickX,
    		formatTickY,
    		includeCaption,
    		spanCol,
    		seriesNames,
    		seriesColors,
    		func
    	];
    }

    class LineChart extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$j, create_fragment$j, safe_not_equal, {
    			caption: 0,
    			activeChart: 1,
    			data: 2,
    			url: 3,
    			groupedData: 4,
    			xKey: 5,
    			yKey: 6,
    			zKey: 7,
    			yDomain: 8,
    			formatTickX: 9,
    			formatTickY: 10,
    			includeCaption: 11,
    			spanCol: 12
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LineChart",
    			options,
    			id: create_fragment$j.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*caption*/ ctx[0] === undefined && !('caption' in props)) {
    			console.warn("<LineChart> was created without expected prop 'caption'");
    		}

    		if (/*activeChart*/ ctx[1] === undefined && !('activeChart' in props)) {
    			console.warn("<LineChart> was created without expected prop 'activeChart'");
    		}

    		if (/*data*/ ctx[2] === undefined && !('data' in props)) {
    			console.warn("<LineChart> was created without expected prop 'data'");
    		}

    		if (/*url*/ ctx[3] === undefined && !('url' in props)) {
    			console.warn("<LineChart> was created without expected prop 'url'");
    		}

    		if (/*groupedData*/ ctx[4] === undefined && !('groupedData' in props)) {
    			console.warn("<LineChart> was created without expected prop 'groupedData'");
    		}

    		if (/*xKey*/ ctx[5] === undefined && !('xKey' in props)) {
    			console.warn("<LineChart> was created without expected prop 'xKey'");
    		}

    		if (/*yKey*/ ctx[6] === undefined && !('yKey' in props)) {
    			console.warn("<LineChart> was created without expected prop 'yKey'");
    		}

    		if (/*zKey*/ ctx[7] === undefined && !('zKey' in props)) {
    			console.warn("<LineChart> was created without expected prop 'zKey'");
    		}

    		if (/*formatTickX*/ ctx[9] === undefined && !('formatTickX' in props)) {
    			console.warn("<LineChart> was created without expected prop 'formatTickX'");
    		}

    		if (/*spanCol*/ ctx[12] === undefined && !('spanCol' in props)) {
    			console.warn("<LineChart> was created without expected prop 'spanCol'");
    		}
    	}

    	get caption() {
    		throw new Error("<LineChart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set caption(value) {
    		throw new Error("<LineChart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get activeChart() {
    		throw new Error("<LineChart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set activeChart(value) {
    		throw new Error("<LineChart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get data() {
    		throw new Error("<LineChart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<LineChart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get url() {
    		throw new Error("<LineChart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set url(value) {
    		throw new Error("<LineChart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get groupedData() {
    		throw new Error("<LineChart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set groupedData(value) {
    		throw new Error("<LineChart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xKey() {
    		throw new Error("<LineChart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xKey(value) {
    		throw new Error("<LineChart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get yKey() {
    		throw new Error("<LineChart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set yKey(value) {
    		throw new Error("<LineChart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get zKey() {
    		throw new Error("<LineChart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set zKey(value) {
    		throw new Error("<LineChart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get yDomain() {
    		throw new Error("<LineChart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set yDomain(value) {
    		throw new Error("<LineChart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get formatTickX() {
    		throw new Error("<LineChart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set formatTickX(value) {
    		throw new Error("<LineChart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get formatTickY() {
    		throw new Error("<LineChart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set formatTickY(value) {
    		throw new Error("<LineChart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get includeCaption() {
    		throw new Error("<LineChart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set includeCaption(value) {
    		throw new Error("<LineChart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get spanCol() {
    		throw new Error("<LineChart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set spanCol(value) {
    		throw new Error("<LineChart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function enforceOrder(arr, order, acc = null) {
        return order.reduce((p, c) => {
            const filter = Number.isInteger(acc) || acc !== null ? arr.filter(d => d[acc] === c) : arr.filter(d => d === c);
            if (filter.length)
                filter.forEach(d => p.push(d));
            return p;
        }, []);
    }
    const prefOrder = ['fL', 'L', 'C', 'AW', 'R', 'fR'];

    /* src/components/graphs/ChartWrapper.svelte generated by Svelte v3.49.0 */

    const { Object: Object_1 } = globals;
    const file$h = "src/components/graphs/ChartWrapper.svelte";

    function get_each_context$d(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	child_ctx[10] = i;
    	return child_ctx;
    }

    function get_each_context_1$b(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[11] = list[i];
    	child_ctx[10] = i;
    	return child_ctx;
    }

    // (31:0) {#if activeChart && activeFig }
    function create_if_block$c(ctx) {
    	let h3;
    	let t0;
    	let show_if = Array.isArray(/*config*/ ctx[0]) && /*config*/ ctx[0].length >= 2;
    	let t1;
    	let div0;
    	let t2;
    	let div1;
    	let linechart;
    	let div1_class_value;
    	let div1_style_value;
    	let current;
    	let if_block = show_if && create_if_block_1$5(ctx);
    	let each_value = enforceOrder(/*groupedData*/ ctx[5].map(func$4), prefOrder);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$d(get_each_context$d(ctx, each_value, i));
    	}

    	linechart = new LineChart({
    			props: {
    				data: /*activeData*/ ctx[2],
    				url: /*activeChart*/ ctx[4],
    				groupedData: /*groupedData*/ ctx[5],
    				xKey: /*activeFig*/ ctx[3].xKey,
    				yKey: /*activeFig*/ ctx[3].yKey,
    				zKey: /*activeFig*/ ctx[3].zKey,
    				activeChart: /*activeChart*/ ctx[4],
    				includeCaption: /*activeFig*/ ctx[3].includeCaption,
    				caption: /*activeFig*/ ctx[3].caption,
    				formatTickX: /*activeFig*/ ctx[3].formatTickX,
    				formatTickY: /*activeFig*/ ctx[3].formatTickY,
    				spanCol: /*spanCol*/ ctx[1]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			t0 = text$1("YouTube consumption:\n        ");
    			if (if_block) if_block.c();
    			t1 = space();
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			div1 = element("div");
    			create_component(linechart.$$.fragment);
    			attr_dev(h3, "class", "chart-title svelte-1pnva5p");
    			add_location(h3, file$h, 31, 4, 1117);
    			attr_dev(div0, "class", "legend-container svelte-1pnva5p");
    			add_location(div0, file$h, 40, 4, 1469);
    			attr_dev(div1, "class", div1_class_value = "" + (null_to_empty(`chart-wrapper ${/*spanCol*/ ctx[1] === 12 ? 'split-cols' : 'single-cols'}`) + " svelte-1pnva5p"));
    			attr_dev(div1, "style", div1_style_value = `--spanCol: ${/*spanCol*/ ctx[1]}`);
    			add_location(div1, file$h, 48, 4, 1885);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);
    			append_dev(h3, t0);
    			if (if_block) if_block.m(h3, null);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div0, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			insert_dev(target, t2, anchor);
    			insert_dev(target, div1, anchor);
    			mount_component(linechart, div1, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*config*/ 1) show_if = Array.isArray(/*config*/ ctx[0]) && /*config*/ ctx[0].length >= 2;

    			if (show_if) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1$5(ctx);
    					if_block.c();
    					if_block.m(h3, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*colorMap, enforceOrder, groupedData, prefOrder, labelMap*/ 32) {
    				each_value = enforceOrder(/*groupedData*/ ctx[5].map(func$4), prefOrder);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$d(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$d(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			const linechart_changes = {};
    			if (dirty & /*activeData*/ 4) linechart_changes.data = /*activeData*/ ctx[2];
    			if (dirty & /*activeChart*/ 16) linechart_changes.url = /*activeChart*/ ctx[4];
    			if (dirty & /*groupedData*/ 32) linechart_changes.groupedData = /*groupedData*/ ctx[5];
    			if (dirty & /*activeFig*/ 8) linechart_changes.xKey = /*activeFig*/ ctx[3].xKey;
    			if (dirty & /*activeFig*/ 8) linechart_changes.yKey = /*activeFig*/ ctx[3].yKey;
    			if (dirty & /*activeFig*/ 8) linechart_changes.zKey = /*activeFig*/ ctx[3].zKey;
    			if (dirty & /*activeChart*/ 16) linechart_changes.activeChart = /*activeChart*/ ctx[4];
    			if (dirty & /*activeFig*/ 8) linechart_changes.includeCaption = /*activeFig*/ ctx[3].includeCaption;
    			if (dirty & /*activeFig*/ 8) linechart_changes.caption = /*activeFig*/ ctx[3].caption;
    			if (dirty & /*activeFig*/ 8) linechart_changes.formatTickX = /*activeFig*/ ctx[3].formatTickX;
    			if (dirty & /*activeFig*/ 8) linechart_changes.formatTickY = /*activeFig*/ ctx[3].formatTickY;
    			if (dirty & /*spanCol*/ 2) linechart_changes.spanCol = /*spanCol*/ ctx[1];
    			linechart.$set(linechart_changes);

    			if (!current || dirty & /*spanCol*/ 2 && div1_class_value !== (div1_class_value = "" + (null_to_empty(`chart-wrapper ${/*spanCol*/ ctx[1] === 12 ? 'split-cols' : 'single-cols'}`) + " svelte-1pnva5p"))) {
    				attr_dev(div1, "class", div1_class_value);
    			}

    			if (!current || dirty & /*spanCol*/ 2 && div1_style_value !== (div1_style_value = `--spanCol: ${/*spanCol*/ ctx[1]}`)) {
    				attr_dev(div1, "style", div1_style_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(linechart.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(linechart.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    			if (if_block) if_block.d();
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div0);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div1);
    			destroy_component(linechart);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$c.name,
    		type: "if",
    		source: "(31:0) {#if activeChart && activeFig }",
    		ctx
    	});

    	return block;
    }

    // (33:8) {#if Array.isArray(config) && config.length >= 2}
    function create_if_block_1$5(ctx) {
    	let select;
    	let mounted;
    	let dispose;
    	let each_value_1 = /*config*/ ctx[0];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$b(get_each_context_1$b(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			select = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(select, "type", "select");
    			if (/*activeChart*/ ctx[4] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[7].call(select));
    			add_location(select, file$h, 33, 12, 1232);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, select, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}

    			select_option(select, /*activeChart*/ ctx[4]);

    			if (!mounted) {
    				dispose = listen_dev(select, "change", /*select_change_handler*/ ctx[7]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*config*/ 1) {
    				each_value_1 = /*config*/ ctx[0];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$b(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$b(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}

    			if (dirty & /*activeChart, config*/ 17) {
    				select_option(select, /*activeChart*/ ctx[4]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(select);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$5.name,
    		type: "if",
    		source: "(33:8) {#if Array.isArray(config) && config.length >= 2}",
    		ctx
    	});

    	return block;
    }

    // (35:16) {#each config as file, i}
    function create_each_block_1$b(ctx) {
    	let option;
    	let t_value = /*file*/ ctx[11].description + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text$1(t_value);
    			option.__value = option_value_value = /*file*/ ctx[11].url;
    			option.value = option.__value;
    			add_location(option, file$h, 35, 20, 1342);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*config*/ 1 && t_value !== (t_value = /*file*/ ctx[11].description + "")) set_data_dev(t, t_value);

    			if (dirty & /*config*/ 1 && option_value_value !== (option_value_value = /*file*/ ctx[11].url)) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$b.name,
    		type: "each",
    		source: "(35:16) {#each config as file, i}",
    		ctx
    	});

    	return block;
    }

    // (42:8) {#each enforceOrder(groupedData.map(d => d[0]), prefOrder) as group, i}
    function create_each_block$d(ctx) {
    	let div;
    	let span;
    	let t0_value = labelMap.get(/*group*/ ctx[8]) + "";
    	let t0;
    	let span_style_value;
    	let t1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			span = element("span");
    			t0 = text$1(t0_value);
    			t1 = space();
    			attr_dev(span, "class", "legend-label svelte-1pnva5p");
    			attr_dev(span, "style", span_style_value = `--color: ${colorMap.get(/*group*/ ctx[8])}`);
    			add_location(span, file$h, 43, 16, 1635);
    			attr_dev(div, "class", "legend-group svelte-1pnva5p");
    			add_location(div, file$h, 42, 12, 1592);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span);
    			append_dev(span, t0);
    			append_dev(div, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*groupedData*/ 32 && t0_value !== (t0_value = labelMap.get(/*group*/ ctx[8]) + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*groupedData*/ 32 && span_style_value !== (span_style_value = `--color: ${colorMap.get(/*group*/ ctx[8])}`)) {
    				attr_dev(span, "style", span_style_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$d.name,
    		type: "each",
    		source: "(42:8) {#each enforceOrder(groupedData.map(d => d[0]), prefOrder) as group, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$i(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*activeChart*/ ctx[4] && /*activeFig*/ ctx[3] && create_if_block$c(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*activeChart*/ ctx[4] && /*activeFig*/ ctx[3]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*activeChart, activeFig*/ 24) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$c(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const func$4 = d => d[0];

    function instance$i($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ChartWrapper', slots, []);
    	let { config } = $$props;
    	let { spanCol = 12 } = $$props;
    	let data = {};
    	let groupedData;
    	let activeData;
    	let activeFig;
    	let activeChart;

    	onMount(async () => {
    		(Array.isArray(config) ? config : [config]).map(async (file, i) => {
    			const d = await csv(file.url, autoType);
    			$$invalidate(6, data[file.url] = d.map(d => Object.assign(Object.assign({}, d), { date: new Date(d.year, d.month, 1) })), data);

    			if (i === 0) {
    				$$invalidate(4, activeChart = file.url);
    				$$invalidate(3, activeFig = file);
    			}
    		});
    	});

    	const writable_props = ['config', 'spanCol'];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ChartWrapper> was created with unknown prop '${key}'`);
    	});

    	function select_change_handler() {
    		activeChart = select_value(this);
    		$$invalidate(4, activeChart);
    		$$invalidate(0, config);
    	}

    	$$self.$$set = $$props => {
    		if ('config' in $$props) $$invalidate(0, config = $$props.config);
    		if ('spanCol' in $$props) $$invalidate(1, spanCol = $$props.spanCol);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		csv,
    		groups,
    		autoType,
    		LineChart,
    		labelMap,
    		colorMap,
    		enforceOrder,
    		prefOrder,
    		config,
    		spanCol,
    		data,
    		groupedData,
    		activeData,
    		activeFig,
    		activeChart
    	});

    	$$self.$inject_state = $$props => {
    		if ('config' in $$props) $$invalidate(0, config = $$props.config);
    		if ('spanCol' in $$props) $$invalidate(1, spanCol = $$props.spanCol);
    		if ('data' in $$props) $$invalidate(6, data = $$props.data);
    		if ('groupedData' in $$props) $$invalidate(5, groupedData = $$props.groupedData);
    		if ('activeData' in $$props) $$invalidate(2, activeData = $$props.activeData);
    		if ('activeFig' in $$props) $$invalidate(3, activeFig = $$props.activeFig);
    		if ('activeChart' in $$props) $$invalidate(4, activeChart = $$props.activeChart);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*data, activeChart*/ 80) {
    			$$invalidate(2, activeData = data ? data[activeChart] : []);
    		}

    		if ($$self.$$.dirty & /*config, activeChart*/ 17) {
    			$$invalidate(3, activeFig = Array.isArray(config)
    			? config.filter(x => x.url === activeChart)[0]
    			: config);
    		}

    		if ($$self.$$.dirty & /*activeData, activeFig*/ 12) {
    			$$invalidate(5, groupedData = activeData
    			? groups(activeData, d => d[activeFig.zKey])
    			: []);
    		}
    	};

    	return [
    		config,
    		spanCol,
    		activeData,
    		activeFig,
    		activeChart,
    		groupedData,
    		data,
    		select_change_handler
    	];
    }

    class ChartWrapper extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, { config: 0, spanCol: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ChartWrapper",
    			options,
    			id: create_fragment$i.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*config*/ ctx[0] === undefined && !('config' in props)) {
    			console.warn("<ChartWrapper> was created without expected prop 'config'");
    		}
    	}

    	get config() {
    		throw new Error("<ChartWrapper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set config(value) {
    		throw new Error("<ChartWrapper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get spanCol() {
    		throw new Error("<ChartWrapper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set spanCol(value) {
    		throw new Error("<ChartWrapper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
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
    			value: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Excepturi temporibus[1] architecto reprehenderit ipsum harum repellendus consequatur magnam numquam quos dicta sunt cupiditate unde, aperiam[2] delectus debitis ab corrupti hic praesentium?"
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
    },
    	"section-three": {
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
    },
    	"section-four": {
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
    },
    	"section-five": {
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

    /* src/components/main/Section1.svelte generated by Svelte v3.49.0 */
    const file$g = "src/components/main/Section1.svelte";

    function get_each_context$c(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$a(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	child_ctx[7] = i;
    	return child_ctx;
    }

    // (39:4) {:else}
    function create_else_block$7(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "chart-placeholder svelte-fjbk1c");
    			add_location(div, file$g, 38, 12, 1688);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$7.name,
    		type: "else",
    		source: "(39:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (11:8) {#if loaded}
    function create_if_block$b(ctx) {
    	let chartwrapper;
    	let current;

    	chartwrapper = new ChartWrapper({
    			props: {
    				config: [
    					{
    						url: 'assets/data/fig3a_smoothed.csv',
    						description: 'Median video duration',
    						type: 'line',
    						xKey: 'date',
    						yKey: 'median_duration',
    						zKey: 'label',
    						includeCaption: true,
    						caption: 'Median monthly video consumption (minutes) across different channel categories. Lines show the 3-month rolling average.',
    						formatTickX: timeFormat('%b %Y'),
    						formatTickY: func$3
    					},
    					{
    						url: 'assets/data/fig3b_smoothed.csv',
    						description: 'Median user consumption duration',
    						type: 'line',
    						xKey: 'date',
    						yKey: 'median_user_watchtime',
    						zKey: 'label',
    						includeCaption: true,
    						caption: 'Median monthly user consumption (minutes) within each community. Lines show the 3-month rolling average.',
    						formatTickX: timeFormat('%b %Y'),
    						formatTickY: func_1$1
    					}
    				]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(chartwrapper.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(chartwrapper, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(chartwrapper.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(chartwrapper.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(chartwrapper, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$b.name,
    		type: "if",
    		source: "(11:8) {#if loaded}",
    		ctx
    	});

    	return block;
    }

    // (42:8) {#each copy['section-one']['copy'] as d, i}
    function create_each_block_1$a(ctx) {
    	let p;
    	let t0_value = /*d*/ ctx[3].value + "";
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text$1(t0_value);
    			t1 = space();
    			add_location(p, file$g, 42, 12, 1823);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$a.name,
    		type: "each",
    		source: "(42:8) {#each copy['section-one']['copy'] as d, i}",
    		ctx
    	});

    	return block;
    }

    // (49:8) {#each copy['section-one']['references'] as d}
    function create_each_block$c(ctx) {
    	let p;
    	let t0_value = /*d*/ ctx[3].value + "";
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text$1(t0_value);
    			t1 = space();
    			add_location(p, file$g, 49, 12, 1993);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$c.name,
    		type: "each",
    		source: "(49:8) {#each copy['section-one']['references'] as d}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$h(ctx) {
    	let div2;
    	let h2;
    	let t1;
    	let current_block_type_index;
    	let if_block;
    	let t2;
    	let div0;
    	let t3;
    	let div1;
    	let inView_action;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block$b, create_else_block$7];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*loaded*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	let each_value_1 = data['section-one']['copy'];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1$a(get_each_context_1$a(ctx, each_value_1, i));
    	}

    	let each_value = data['section-one']['references'];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$c(get_each_context$c(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			h2 = element("h2");
    			h2.textContent = "Section 1 title";
    			t1 = space();
    			if_block.c();
    			t2 = space();
    			div0 = element("div");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t3 = space();
    			div1 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(h2, "class", "section-title svelte-fjbk1c");
    			add_location(h2, file$g, 9, 4, 338);
    			attr_dev(div0, "class", "copy svelte-fjbk1c");
    			add_location(div0, file$g, 40, 4, 1740);
    			attr_dev(div1, "class", "references svelte-fjbk1c");
    			add_location(div1, file$g, 47, 4, 1901);
    			attr_dev(div2, "class", "section section-1 svelte-fjbk1c");
    			add_location(div2, file$g, 8, 0, 248);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, h2);
    			append_dev(div2, t1);
    			if_blocks[current_block_type_index].m(div2, null);
    			append_dev(div2, t2);
    			append_dev(div2, div0);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div0, null);
    			}

    			append_dev(div2, t3);
    			append_dev(div2, div1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(inView_action = inView.call(null, div2, { once: /*once*/ ctx[0] })),
    					listen_dev(div2, "enter", /*enter_handler*/ ctx[2], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div2, t2);
    			}

    			if (dirty & /*copy*/ 0) {
    				each_value_1 = data['section-one']['copy'];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$a(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1$a(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty & /*copy*/ 0) {
    				each_value = data['section-one']['references'];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$c(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$c(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (inView_action && is_function(inView_action.update) && dirty & /*once*/ 1) inView_action.update.call(null, { once: /*once*/ ctx[0] });
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if_blocks[current_block_type_index].d();
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const func$3 = d => d.toFixed(0);
    const func_1$1 = d => d.toFixed(0);

    function instance$h($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Section1', slots, []);
    	let loaded = false;
    	let { once } = $$props;
    	const writable_props = ['once'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Section1> was created with unknown prop '${key}'`);
    	});

    	const enter_handler = () => $$invalidate(1, loaded = true);

    	$$self.$$set = $$props => {
    		if ('once' in $$props) $$invalidate(0, once = $$props.once);
    	};

    	$$self.$capture_state = () => ({
    		timeFormat,
    		inView,
    		ChartWrapper,
    		copy: data,
    		loaded,
    		once
    	});

    	$$self.$inject_state = $$props => {
    		if ('loaded' in $$props) $$invalidate(1, loaded = $$props.loaded);
    		if ('once' in $$props) $$invalidate(0, once = $$props.once);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [once, loaded, enter_handler];
    }

    class Section1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, { once: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Section1",
    			options,
    			id: create_fragment$h.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*once*/ ctx[0] === undefined && !('once' in props)) {
    			console.warn("<Section1> was created without expected prop 'once'");
    		}
    	}

    	get once() {
    		throw new Error("<Section1>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set once(value) {
    		throw new Error("<Section1>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/main/Section2.svelte generated by Svelte v3.49.0 */
    const file$f = "src/components/main/Section2.svelte";

    function get_each_context$b(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$9(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	child_ctx[9] = i;
    	return child_ctx;
    }

    // (39:4) {:else}
    function create_else_block$6(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "chart-placeholder svelte-1ujva5");
    			add_location(div, file$f, 38, 12, 1487);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$6.name,
    		type: "else",
    		source: "(39:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (11:4) {#if loaded}
    function create_if_block$a(ctx) {
    	let chartwrapper;
    	let current;

    	chartwrapper = new ChartWrapper({
    			props: {
    				config: [
    					{
    						url: 'assets/data/fig2a_ledwich.csv',
    						description: 'User share',
    						type: 'line',
    						xKey: 'date',
    						yKey: 'user_percent',
    						zKey: 'label',
    						includeCaption: true,
    						caption: 'Percent of users falling into the six political categories.',
    						formatTickX: timeFormat('%b %Y'),
    						formatTickY: /*func*/ ctx[2]
    					},
    					{
    						url: 'assets/data/fig2b_ledwich.csv',
    						description: 'Total consumption share',
    						type: 'line',
    						xKey: 'date',
    						yKey: 'percentage_duration',
    						zKey: 'label',
    						includeCaption: true,
    						caption: 'Consumption share of the six political channel categories.',
    						formatTickX: timeFormat('%b %Y'),
    						formatTickY: /*func_1*/ ctx[3]
    					}
    				]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(chartwrapper.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(chartwrapper, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(chartwrapper.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(chartwrapper.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(chartwrapper, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$a.name,
    		type: "if",
    		source: "(11:4) {#if loaded}",
    		ctx
    	});

    	return block;
    }

    // (42:8) {#each copy['section-two']['copy'] as d, i}
    function create_each_block_1$9(ctx) {
    	let p;
    	let t0_value = /*d*/ ctx[5].value + "";
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text$1(t0_value);
    			t1 = space();
    			add_location(p, file$f, 42, 12, 1622);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$9.name,
    		type: "each",
    		source: "(42:8) {#each copy['section-two']['copy'] as d, i}",
    		ctx
    	});

    	return block;
    }

    // (49:8) {#each copy['section-two']['references'] as d}
    function create_each_block$b(ctx) {
    	let p;
    	let t0_value = /*d*/ ctx[5].value + "";
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text$1(t0_value);
    			t1 = space();
    			add_location(p, file$f, 49, 12, 1792);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$b.name,
    		type: "each",
    		source: "(49:8) {#each copy['section-two']['references'] as d}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$g(ctx) {
    	let div2;
    	let current_block_type_index;
    	let if_block;
    	let t0;
    	let div0;
    	let t1;
    	let div1;
    	let inView_action;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block$a, create_else_block$6];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*loaded*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	let each_value_1 = data['section-two']['copy'];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1$9(get_each_context_1$9(ctx, each_value_1, i));
    	}

    	let each_value = data['section-two']['references'];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$b(get_each_context$b(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			if_block.c();
    			t0 = space();
    			div0 = element("div");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t1 = space();
    			div1 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div0, "class", "copy svelte-1ujva5");
    			add_location(div0, file$f, 40, 4, 1539);
    			attr_dev(div1, "class", "references svelte-1ujva5");
    			add_location(div1, file$f, 47, 4, 1700);
    			attr_dev(div2, "class", "section section-2 svelte-1ujva5");
    			add_location(div2, file$f, 9, 0, 284);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			if_blocks[current_block_type_index].m(div2, null);
    			append_dev(div2, t0);
    			append_dev(div2, div0);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div0, null);
    			}

    			append_dev(div2, t1);
    			append_dev(div2, div1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(inView_action = inView.call(null, div2, { once: /*once*/ ctx[0] })),
    					listen_dev(div2, "enter", /*enter_handler*/ ctx[4], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div2, t0);
    			}

    			if (dirty & /*copy*/ 0) {
    				each_value_1 = data['section-two']['copy'];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$9(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1$9(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty & /*copy*/ 0) {
    				each_value = data['section-two']['references'];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$b(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$b(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (inView_action && is_function(inView_action.update) && dirty & /*once*/ 1) inView_action.update.call(null, { once: /*once*/ ctx[0] });
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if_blocks[current_block_type_index].d();
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Section2', slots, []);
    	let loaded = false;
    	let { once } = $$props;
    	const writable_props = ['once'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Section2> was created with unknown prop '${key}'`);
    	});

    	const func = d => format('.1%')(d).replace(/[.,]0+/, "");
    	const func_1 = d => format('.2%')(d).replace(/[.,]0+/, "");
    	const enter_handler = () => $$invalidate(1, loaded = true);

    	$$self.$$set = $$props => {
    		if ('once' in $$props) $$invalidate(0, once = $$props.once);
    	};

    	$$self.$capture_state = () => ({
    		timeFormat,
    		format,
    		inView,
    		ChartWrapper,
    		copy: data,
    		loaded,
    		once
    	});

    	$$self.$inject_state = $$props => {
    		if ('loaded' in $$props) $$invalidate(1, loaded = $$props.loaded);
    		if ('once' in $$props) $$invalidate(0, once = $$props.once);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [once, loaded, func, func_1, enter_handler];
    }

    class Section2 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, { once: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Section2",
    			options,
    			id: create_fragment$g.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*once*/ ctx[0] === undefined && !('once' in props)) {
    			console.warn("<Section2> was created without expected prop 'once'");
    		}
    	}

    	get once() {
    		throw new Error("<Section2>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set once(value) {
    		throw new Error("<Section2>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/graphs/atoms/BarStacked.svelte generated by Svelte v3.49.0 */
    const file$e = "src/components/graphs/atoms/BarStacked.svelte";

    function get_each_context$a(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[19] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$8(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[22] = list[i];
    	child_ctx[24] = i;
    	return child_ctx;
    }

    // (34:12) {#each series as d, i}
    function create_each_block_1$8(ctx) {
    	let rect;
    	let rect_x_value;
    	let rect_y_value;
    	let rect_height_value;
    	let rect_width_value;
    	let rect_fill_value;
    	let mounted;
    	let dispose;

    	function mouseover_handler(...args) {
    		return /*mouseover_handler*/ ctx[13](/*series*/ ctx[19], /*d*/ ctx[22], ...args);
    	}

    	function focus_handler(...args) {
    		return /*focus_handler*/ ctx[14](/*d*/ ctx[22], ...args);
    	}

    	const block = {
    		c: function create() {
    			rect = svg_element("rect");
    			attr_dev(rect, "class", "group-rect svelte-yc7lmv");
    			attr_dev(rect, "data-id", /*i*/ ctx[24]);
    			attr_dev(rect, "x", rect_x_value = /*$xGet*/ ctx[0](/*d*/ ctx[22])[0]);
    			attr_dev(rect, "y", rect_y_value = /*$yGet*/ ctx[3](/*d*/ ctx[22]));
    			attr_dev(rect, "height", rect_height_value = /*$yScale*/ ctx[4].bandwidth());
    			attr_dev(rect, "width", rect_width_value = /*columnWidth*/ ctx[1](/*d*/ ctx[22]));
    			attr_dev(rect, "fill", rect_fill_value = /*$zGet*/ ctx[5](/*series*/ ctx[19]));
    			attr_dev(rect, "stroke", "white");
    			add_location(rect, file$e, 34, 16, 996);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, rect, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(rect, "mouseover", mouseover_handler, false, false, false),
    					listen_dev(rect, "focus", focus_handler, false, false, false),
    					listen_dev(rect, "mouseout", /*mouseout_handler*/ ctx[15], false, false, false),
    					listen_dev(rect, "blur", /*blur_handler*/ ctx[16], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*$xGet, $data*/ 5 && rect_x_value !== (rect_x_value = /*$xGet*/ ctx[0](/*d*/ ctx[22])[0])) {
    				attr_dev(rect, "x", rect_x_value);
    			}

    			if (dirty & /*$yGet, $data*/ 12 && rect_y_value !== (rect_y_value = /*$yGet*/ ctx[3](/*d*/ ctx[22]))) {
    				attr_dev(rect, "y", rect_y_value);
    			}

    			if (dirty & /*$yScale*/ 16 && rect_height_value !== (rect_height_value = /*$yScale*/ ctx[4].bandwidth())) {
    				attr_dev(rect, "height", rect_height_value);
    			}

    			if (dirty & /*columnWidth, $data*/ 6 && rect_width_value !== (rect_width_value = /*columnWidth*/ ctx[1](/*d*/ ctx[22]))) {
    				attr_dev(rect, "width", rect_width_value);
    			}

    			if (dirty & /*$zGet, $data*/ 36 && rect_fill_value !== (rect_fill_value = /*$zGet*/ ctx[5](/*series*/ ctx[19]))) {
    				attr_dev(rect, "fill", rect_fill_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(rect);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$8.name,
    		type: "each",
    		source: "(34:12) {#each series as d, i}",
    		ctx
    	});

    	return block;
    }

    // (32:4) {#each $data as series}
    function create_each_block$a(ctx) {
    	let g;
    	let g_class_value;
    	let each_value_1 = /*series*/ ctx[19];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$8(get_each_context_1$8(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			g = svg_element("g");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(g, "class", g_class_value = "" + (null_to_empty(`series-group series-${/*series*/ ctx[19].key}`) + " svelte-yc7lmv"));
    			add_location(g, file$e, 32, 8, 897);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, g, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(g, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$xGet, $data, $yGet, $yScale, columnWidth, $zGet, handleMouseOver, handleMouseOut*/ 6207) {
    				each_value_1 = /*series*/ ctx[19];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$8(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$8(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(g, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}

    			if (dirty & /*$data*/ 4 && g_class_value !== (g_class_value = "" + (null_to_empty(`series-group series-${/*series*/ ctx[19].key}`) + " svelte-yc7lmv"))) {
    				attr_dev(g, "class", g_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(g);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$a.name,
    		type: "each",
    		source: "(32:4) {#each $data as series}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$f(ctx) {
    	let g;
    	let each_value = /*$data*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$a(get_each_context$a(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			g = svg_element("g");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(g, "class", "bar-group");
    			add_location(g, file$e, 30, 0, 839);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, g, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(g, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$data, $xGet, $yGet, $yScale, columnWidth, $zGet, handleMouseOver, handleMouseOut*/ 6207) {
    				each_value = /*$data*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$a(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$a(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(g, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(g);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let columnWidth;
    	let $xGet;
    	let $data;
    	let $yGet;
    	let $yScale;
    	let $zGet;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('BarStacked', slots, []);
    	const { data, xGet, yGet, zGet, yScale, zScale } = getContext('LayerCake');
    	validate_store(data, 'data');
    	component_subscribe($$self, data, value => $$invalidate(2, $data = value));
    	validate_store(xGet, 'xGet');
    	component_subscribe($$self, xGet, value => $$invalidate(0, $xGet = value));
    	validate_store(yGet, 'yGet');
    	component_subscribe($$self, yGet, value => $$invalidate(3, $yGet = value));
    	validate_store(zGet, 'zGet');
    	component_subscribe($$self, zGet, value => $$invalidate(5, $zGet = value));
    	validate_store(yScale, 'yScale');
    	component_subscribe($$self, yScale, value => $$invalidate(4, $yScale = value));
    	const dispatch = createEventDispatcher();

    	function handleMouseOver(e, d) {
    		dispatch('mousemove', { e, props: d });

    		document.querySelectorAll('.group-rect').forEach(el => {
    			if (el !== e.target) el.classList.add('inactive'); else el.classList.add('active');
    		});
    	}

    	function handleMouseOut(e) {
    		dispatch('mouseout');
    		document.querySelectorAll('.group-rect').forEach(el => el.classList.remove('inactive'));
    		e.target.classList.remove('active');
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<BarStacked> was created with unknown prop '${key}'`);
    	});

    	const mouseover_handler = (series, d, e) => handleMouseOver(e, { key: series.key, ...d.data });
    	const focus_handler = (d, e) => handleMouseOver(e, d);
    	const mouseout_handler = e => handleMouseOut(e);
    	const blur_handler = e => handleMouseOut(e);

    	$$self.$capture_state = () => ({
    		getContext,
    		createEventDispatcher,
    		data,
    		xGet,
    		yGet,
    		zGet,
    		yScale,
    		zScale,
    		dispatch,
    		handleMouseOver,
    		handleMouseOut,
    		columnWidth,
    		$xGet,
    		$data,
    		$yGet,
    		$yScale,
    		$zGet
    	});

    	$$self.$inject_state = $$props => {
    		if ('columnWidth' in $$props) $$invalidate(1, columnWidth = $$props.columnWidth);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$xGet*/ 1) {
    			$$invalidate(1, columnWidth = d => {
    				const xVals = $xGet(d);
    				return xVals[1] - xVals[0];
    			});
    		}
    	};

    	return [
    		$xGet,
    		columnWidth,
    		$data,
    		$yGet,
    		$yScale,
    		$zGet,
    		data,
    		xGet,
    		yGet,
    		zGet,
    		yScale,
    		handleMouseOver,
    		handleMouseOut,
    		mouseover_handler,
    		focus_handler,
    		mouseout_handler,
    		blur_handler
    	];
    }

    class BarStacked extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "BarStacked",
    			options,
    			id: create_fragment$f.name
    		});
    	}
    }

    const formatPct = (n) => {
        return format(`.${n}~%`);
    };
    const formatThousands = format(',.0s');
    const formatThousandsComma = format(',.0f');

    /* src/components/graphs/StackedBars.svelte generated by Svelte v3.49.0 */
    const file$d = "src/components/graphs/StackedBars.svelte";

    function get_each_context_1$7(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[29] = list[i];
    	const constants_0 = /*tooltipData*/ child_ctx[28][/*tooltipData*/ child_ctx[28].key];
    	child_ctx[30] = constants_0;
    	return child_ctx;
    }

    function get_each_context$9(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[29] = list[i];
    	const constants_0 = /*tooltipData*/ child_ctx[28][/*tooltipData*/ child_ctx[28].key];
    	child_ctx[30] = constants_0;
    	return child_ctx;
    }

    function get_else_ctx(ctx) {
    	const child_ctx = ctx.slice();
    	const constants_0 = { .../*detail*/ child_ctx[27].props };
    	child_ctx[28] = constants_0;
    	return child_ctx;
    }

    function get_if_ctx(ctx) {
    	const child_ctx = ctx.slice();
    	const constants_0 = { .../*detail*/ child_ctx[27].props };
    	child_ctx[28] = constants_0;
    	return child_ctx;
    }

    function get_each_context_2$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[35] = list[i];
    	child_ctx[37] = i;
    	return child_ctx;
    }

    // (41:1) {#each data.columns.filter(d => d !== 'cluster') as group, i}
    function create_each_block_2$1(ctx) {
    	let div;
    	let span;
    	let t0_value = /*keyLabelMap*/ ctx[7].get(/*group*/ ctx[35]) + "";
    	let t0;
    	let span_style_value;
    	let t1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			span = element("span");
    			t0 = text$1(t0_value);
    			t1 = space();
    			attr_dev(span, "class", "legend-label svelte-13righf");
    			attr_dev(span, "style", span_style_value = `--color: ${/*keyColorMap*/ ctx[9].get(/*group*/ ctx[35])}`);
    			add_location(span, file$d, 42, 3, 1584);
    			attr_dev(div, "class", "legend-group svelte-13righf");
    			add_location(div, file$d, 41, 2, 1554);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span);
    			append_dev(span, t0);
    			append_dev(div, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*keyLabelMap, data*/ 129 && t0_value !== (t0_value = /*keyLabelMap*/ ctx[7].get(/*group*/ ctx[35]) + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*keyColorMap, data*/ 513 && span_style_value !== (span_style_value = `--color: ${/*keyColorMap*/ ctx[9].get(/*group*/ ctx[35])}`)) {
    				attr_dev(span, "style", span_style_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2$1.name,
    		type: "each",
    		source: "(41:1) {#each data.columns.filter(d => d !== 'cluster') as group, i}",
    		ctx
    	});

    	return block;
    }

    // (65:3) <Svg>
    function create_default_slot_3$2(ctx) {
    	let axisx;
    	let t0;
    	let axisy;
    	let t1;
    	let barstacked;
    	let current;

    	axisx = new AxisX({
    			props: {
    				gridlines: false,
    				ticks: 3,
    				snapTicks: true,
    				tickMarks: true
    			},
    			$$inline: true
    		});

    	axisy = new AxisY({
    			props: {
    				gridlines: false,
    				formatTick: /*func_1*/ ctx[21]
    			},
    			$$inline: true
    		});

    	barstacked = new BarStacked({ $$inline: true });
    	barstacked.$on("mousemove", /*mousemove_handler*/ ctx[22]);
    	barstacked.$on("mouseout", /*mouseout_handler*/ ctx[23]);

    	const block = {
    		c: function create() {
    			create_component(axisx.$$.fragment);
    			t0 = space();
    			create_component(axisy.$$.fragment);
    			t1 = space();
    			create_component(barstacked.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(axisx, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(axisy, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(barstacked, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const axisy_changes = {};
    			if (dirty[0] & /*clusterLabelMap*/ 64) axisy_changes.formatTick = /*func_1*/ ctx[21];
    			axisy.$set(axisy_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(axisx.$$.fragment, local);
    			transition_in(axisy.$$.fragment, local);
    			transition_in(barstacked.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(axisx.$$.fragment, local);
    			transition_out(axisy.$$.fragment, local);
    			transition_out(barstacked.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(axisx, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(axisy, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(barstacked, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$2.name,
    		type: "slot",
    		source: "(65:3) <Svg>",
    		ctx
    	});

    	return block;
    }

    // (81:4) {#if hideTooltip !== true}
    function create_if_block_1$4(ctx) {
    	let tooltip;
    	let current;

    	tooltip = new Tooltip({
    			props: {
    				evt: /*evt*/ ctx[15],
    				offset: -10,
    				$$slots: {
    					default: [
    						create_default_slot_2$3,
    						({ detail }) => ({ 27: detail }),
    						({ detail }) => [detail ? 134217728 : 0]
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(tooltip.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(tooltip, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const tooltip_changes = {};
    			if (dirty[0] & /*evt*/ 32768) tooltip_changes.evt = /*evt*/ ctx[15];

    			if (dirty[0] & /*formatter, detail, clusterColorMap, clusterLabelMap, keyColorMap, keyLabelMap, tooltipType*/ 134235104 | dirty[1] & /*$$scope*/ 128) {
    				tooltip_changes.$$scope = { dirty, ctx };
    			}

    			tooltip.$set(tooltip_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tooltip.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tooltip.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tooltip, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(81:4) {#if hideTooltip !== true}",
    		ctx
    	});

    	return block;
    }

    // (108:7) {:else}
    function create_else_block$5(ctx) {
    	let div;
    	let p0;
    	let t0;
    	let span0;
    	let t1_value = /*clusterLabelMap*/ ctx[6].get(/*tooltipData*/ ctx[28].cluster) + "";
    	let t1;
    	let t2;
    	let p1;
    	let t3;
    	let span1;
    	let t4_value = /*keyLabelMap*/ ctx[7].get(/*tooltipData*/ ctx[28].key) + "";
    	let t4;
    	let t5;
    	let each_1_anchor;
    	let each_value_1 = ['value'];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < 1; i += 1) {
    		each_blocks[i] = create_each_block_1$7(get_each_context_1$7(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			p0 = element("p");
    			t0 = text$1("Community: ");
    			span0 = element("span");
    			t1 = text$1(t1_value);
    			t2 = space();
    			p1 = element("p");
    			t3 = text$1("Content: ");
    			span1 = element("span");
    			t4 = text$1(t4_value);
    			t5 = space();

    			for (let i = 0; i < 1; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    			attr_dev(span0, "class", "cluster-label svelte-13righf");
    			set_style(span0, "--color", /*clusterColorMap*/ ctx[8].get(/*tooltipData*/ ctx[28].cluster));
    			add_location(span0, file$d, 110, 23, 3442);
    			add_location(p0, file$d, 110, 9, 3428);
    			attr_dev(span1, "class", "cluster-label svelte-13righf");
    			set_style(span1, "--color", /*keyColorMap*/ ctx[9].get(/*tooltipData*/ ctx[28].key));
    			add_location(span1, file$d, 116, 21, 3658);
    			add_location(p1, file$d, 116, 9, 3646);
    			add_location(div, file$d, 109, 8, 3413);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p0);
    			append_dev(p0, t0);
    			append_dev(p0, span0);
    			append_dev(span0, t1);
    			append_dev(div, t2);
    			append_dev(div, p1);
    			append_dev(p1, t3);
    			append_dev(p1, span1);
    			append_dev(span1, t4);
    			insert_dev(target, t5, anchor);

    			for (let i = 0; i < 1; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*clusterLabelMap, detail*/ 134217792 && t1_value !== (t1_value = /*clusterLabelMap*/ ctx[6].get(/*tooltipData*/ ctx[28].cluster) + "")) set_data_dev(t1, t1_value);

    			if (dirty[0] & /*clusterColorMap, detail*/ 134217984) {
    				set_style(span0, "--color", /*clusterColorMap*/ ctx[8].get(/*tooltipData*/ ctx[28].cluster));
    			}

    			if (dirty[0] & /*keyLabelMap, detail*/ 134217856 && t4_value !== (t4_value = /*keyLabelMap*/ ctx[7].get(/*tooltipData*/ ctx[28].key) + "")) set_data_dev(t4, t4_value);

    			if (dirty[0] & /*keyColorMap, detail*/ 134218240) {
    				set_style(span1, "--color", /*keyColorMap*/ ctx[9].get(/*tooltipData*/ ctx[28].key));
    			}

    			if (dirty[0] & /*formatter, detail*/ 134217760) {
    				each_value_1 = ['value'];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < 1; i += 1) {
    					const child_ctx = get_each_context_1$7(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$7(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < 1; i += 1) {
    					each_blocks[i].d(1);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t5);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$5.name,
    		type: "else",
    		source: "(108:7) {:else}",
    		ctx
    	});

    	return block;
    }

    // (87:6) {#if tooltipType === 'arrow'}
    function create_if_block_2(ctx) {
    	let div;
    	let span0;
    	let t0_value = /*keyLabelMap*/ ctx[7].get(/*tooltipData*/ ctx[28].key) + "";
    	let t0;
    	let t1;
    	let span1;
    	let t2_value = /*clusterLabelMap*/ ctx[6].get(/*tooltipData*/ ctx[28].cluster) + "";
    	let t2;
    	let t3;
    	let each_1_anchor;
    	let each_value = ['value'];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < 1; i += 1) {
    		each_blocks[i] = create_each_block$9(get_each_context$9(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			span0 = element("span");
    			t0 = text$1(t0_value);
    			t1 = text$1(" ➞\n\t\t\t\t\t\t\t\t");
    			span1 = element("span");
    			t2 = text$1(t2_value);
    			t3 = space();

    			for (let i = 0; i < 1; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    			attr_dev(span0, "class", "cluster-label svelte-13righf");
    			set_style(span0, "--color", /*keyColorMap*/ ctx[9].get(/*tooltipData*/ ctx[28].key));
    			add_location(span0, file$d, 89, 8, 2809);
    			attr_dev(span1, "class", "cluster-label svelte-13righf");
    			set_style(span1, "--color", /*clusterColorMap*/ ctx[8].get(/*tooltipData*/ ctx[28].cluster));
    			add_location(span1, file$d, 95, 8, 2987);
    			add_location(div, file$d, 88, 7, 2795);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span0);
    			append_dev(span0, t0);
    			append_dev(div, t1);
    			append_dev(div, span1);
    			append_dev(span1, t2);
    			insert_dev(target, t3, anchor);

    			for (let i = 0; i < 1; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*keyLabelMap, detail*/ 134217856 && t0_value !== (t0_value = /*keyLabelMap*/ ctx[7].get(/*tooltipData*/ ctx[28].key) + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*keyColorMap, detail*/ 134218240) {
    				set_style(span0, "--color", /*keyColorMap*/ ctx[9].get(/*tooltipData*/ ctx[28].key));
    			}

    			if (dirty[0] & /*clusterLabelMap, detail*/ 134217792 && t2_value !== (t2_value = /*clusterLabelMap*/ ctx[6].get(/*tooltipData*/ ctx[28].cluster) + "")) set_data_dev(t2, t2_value);

    			if (dirty[0] & /*clusterColorMap, detail*/ 134217984) {
    				set_style(span1, "--color", /*clusterColorMap*/ ctx[8].get(/*tooltipData*/ ctx[28].cluster));
    			}

    			if (dirty[0] & /*formatter, detail*/ 134217760) {
    				each_value = ['value'];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < 1; i += 1) {
    					const child_ctx = get_each_context$9(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$9(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < 1; i += 1) {
    					each_blocks[i].d(1);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t3);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(87:6) {#if tooltipType === 'arrow'}",
    		ctx
    	});

    	return block;
    }

    // (125:8) {#each ['value'] as key}
    function create_each_block_1$7(ctx) {
    	let div;
    	let t0;
    	let t1_value = /*formatter*/ ctx[5](/*value*/ ctx[30]) + "";
    	let t1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text$1("Share: ");
    			t1 = text$1(t1_value);
    			attr_dev(div, "class", "row");
    			add_location(div, file$d, 126, 9, 3957);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*formatter, detail*/ 134217760 && t1_value !== (t1_value = /*formatter*/ ctx[5](/*value*/ ctx[30]) + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$7.name,
    		type: "each",
    		source: "(125:8) {#each ['value'] as key}",
    		ctx
    	});

    	return block;
    }

    // (103:7) {#each ['value'] as key}
    function create_each_block$9(ctx) {
    	let div;
    	let t_value = /*formatter*/ ctx[5](/*value*/ ctx[30]) + "";
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text$1(t_value);
    			attr_dev(div, "class", "row");
    			add_location(div, file$d, 104, 8, 3281);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*formatter, detail*/ 134217760 && t_value !== (t_value = /*formatter*/ ctx[5](/*value*/ ctx[30]) + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$9.name,
    		type: "each",
    		source: "(103:7) {#each ['value'] as key}",
    		ctx
    	});

    	return block;
    }

    // (82:5) <Tooltip       {evt}       offset={-10}       let:detail      >
    function create_default_slot_2$3(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*tooltipType*/ ctx[14] === 'arrow') return create_if_block_2;
    		return create_else_block$5;
    	}

    	function select_block_ctx(ctx, type) {
    		if (type === create_if_block_2) return get_if_ctx(ctx);
    		return get_else_ctx(ctx);
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(select_block_ctx(ctx, current_block_type));

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(select_block_ctx(ctx, current_block_type), dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(select_block_ctx(ctx, current_block_type));

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$3.name,
    		type: "slot",
    		source: "(82:5) <Tooltip       {evt}       offset={-10}       let:detail      >",
    		ctx
    	});

    	return block;
    }

    // (78:3) <Html     pointerEvents={false}    >
    function create_default_slot_1$3(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*hideTooltip*/ ctx[16] !== true && create_if_block_1$4(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*hideTooltip*/ ctx[16] !== true) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*hideTooltip*/ 65536) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1$4(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$3.name,
    		type: "slot",
    		source: "(78:3) <Html     pointerEvents={false}    >",
    		ctx
    	});

    	return block;
    }

    // (52:2) <LayerCake    padding={{ top: 0, right: 0, bottom: 15, left: 45 }}    flatData={ flatten(stackedData) }    data={ stackedData }    x={ xKey }    y={ d => d.data[yKey] }    yScale={ scaleBand().paddingInner([0.35]).paddingOuter([0.01]).round(true) }    { yDomain }    z={ zKey }    zScale={ scaleOrdinal() }    zDomain={ yDomain }    zRange={ zRange }   >
    function create_default_slot$4(ctx) {
    	let svg;
    	let t;
    	let html;
    	let current;

    	svg = new Svg({
    			props: {
    				$$slots: { default: [create_default_slot_3$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	html = new Html({
    			props: {
    				pointerEvents: false,
    				$$slots: { default: [create_default_slot_1$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(svg.$$.fragment);
    			t = space();
    			create_component(html.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(svg, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(html, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const svg_changes = {};

    			if (dirty[0] & /*evt, hideTooltip, clusterLabelMap*/ 98368 | dirty[1] & /*$$scope*/ 128) {
    				svg_changes.$$scope = { dirty, ctx };
    			}

    			svg.$set(svg_changes);
    			const html_changes = {};

    			if (dirty[0] & /*evt, formatter, clusterColorMap, clusterLabelMap, keyColorMap, keyLabelMap, tooltipType, hideTooltip*/ 115680 | dirty[1] & /*$$scope*/ 128) {
    				html_changes.$$scope = { dirty, ctx };
    			}

    			html.$set(html_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(svg.$$.fragment, local);
    			transition_in(html.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(svg.$$.fragment, local);
    			transition_out(html.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(svg, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(html, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$4.name,
    		type: "slot",
    		source: "(52:2) <LayerCake    padding={{ top: 0, right: 0, bottom: 15, left: 45 }}    flatData={ flatten(stackedData) }    data={ stackedData }    x={ xKey }    y={ d => d.data[yKey] }    yScale={ scaleBand().paddingInner([0.35]).paddingOuter([0.01]).round(true) }    { yDomain }    z={ zKey }    zScale={ scaleOrdinal() }    zDomain={ yDomain }    zRange={ zRange }   >",
    		ctx
    	});

    	return block;
    }

    // (135:1) {#if includeCaption}
    function create_if_block$9(ctx) {
    	let caption_1;
    	let current;

    	caption_1 = new Caption({
    			props: {
    				caption: /*caption*/ ctx[10],
    				url: /*url*/ ctx[1],
    				type: /*spanCol*/ ctx[12] === 12
    				? 'split-cols'
    				: 'single-cols'
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(caption_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(caption_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const caption_1_changes = {};
    			if (dirty[0] & /*caption*/ 1024) caption_1_changes.caption = /*caption*/ ctx[10];
    			if (dirty[0] & /*url*/ 2) caption_1_changes.url = /*url*/ ctx[1];

    			if (dirty[0] & /*spanCol*/ 4096) caption_1_changes.type = /*spanCol*/ ctx[12] === 12
    			? 'split-cols'
    			: 'single-cols';

    			caption_1.$set(caption_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(caption_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(caption_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(caption_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$9.name,
    		type: "if",
    		source: "(135:1) {#if includeCaption}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$e(ctx) {
    	let div0;
    	let t0;
    	let div2;
    	let div1;
    	let layercake;
    	let div1_class_value;
    	let t1;
    	let div2_class_value;
    	let div2_style_value;
    	let current;
    	let each_value_2 = /*data*/ ctx[0].columns.filter(func$2);
    	validate_each_argument(each_value_2);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2$1(get_each_context_2$1(ctx, each_value_2, i));
    	}

    	layercake = new LayerCake({
    			props: {
    				padding: { top: 0, right: 0, bottom: 15, left: 45 },
    				flatData: flatten(/*stackedData*/ ctx[17]),
    				data: /*stackedData*/ ctx[17],
    				x: /*xKey*/ ctx[3],
    				y: /*func_2*/ ctx[24],
    				yScale: band().paddingInner([0.35]).paddingOuter([0.01]).round(true),
    				yDomain: /*yDomain*/ ctx[18],
    				z: /*zKey*/ ctx[4],
    				zScale: ordinal(),
    				zDomain: /*yDomain*/ ctx[18],
    				zRange: /*zRange*/ ctx[19],
    				$$slots: { default: [create_default_slot$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let if_block = /*includeCaption*/ ctx[11] && create_if_block$9(ctx);

    	const block = {
    		c: function create() {
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t0 = space();
    			div2 = element("div");
    			div1 = element("div");
    			create_component(layercake.$$.fragment);
    			t1 = space();
    			if (if_block) if_block.c();
    			attr_dev(div0, "class", "legend-container svelte-13righf");
    			add_location(div0, file$d, 39, 0, 1458);
    			attr_dev(div1, "class", div1_class_value = "" + (null_to_empty(`chart stacked-bar-chart ${/*customClass*/ ctx[13]}`) + " svelte-13righf"));
    			add_location(div1, file$d, 50, 1, 1830);

    			attr_dev(div2, "class", div2_class_value = "" + (null_to_empty(`chart-wrapper ${/*spanCol*/ ctx[12] === 12
			? 'split-cols'
			: 'single-cols'}`) + " svelte-13righf"));

    			attr_dev(div2, "style", div2_style_value = `--spanCol: ${/*spanCol*/ ctx[12]}`);
    			add_location(div2, file$d, 46, 0, 1713);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			insert_dev(target, t0, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			mount_component(layercake, div1, null);
    			append_dev(div2, t1);
    			if (if_block) if_block.m(div2, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*keyColorMap, data, keyLabelMap*/ 641) {
    				each_value_2 = /*data*/ ctx[0].columns.filter(func$2);
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2$1(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_2$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_2.length;
    			}

    			const layercake_changes = {};
    			if (dirty[0] & /*xKey*/ 8) layercake_changes.x = /*xKey*/ ctx[3];
    			if (dirty[0] & /*yKey*/ 4) layercake_changes.y = /*func_2*/ ctx[24];
    			if (dirty[0] & /*zKey*/ 16) layercake_changes.z = /*zKey*/ ctx[4];

    			if (dirty[0] & /*evt, formatter, clusterColorMap, clusterLabelMap, keyColorMap, keyLabelMap, tooltipType, hideTooltip*/ 115680 | dirty[1] & /*$$scope*/ 128) {
    				layercake_changes.$$scope = { dirty, ctx };
    			}

    			layercake.$set(layercake_changes);

    			if (!current || dirty[0] & /*customClass*/ 8192 && div1_class_value !== (div1_class_value = "" + (null_to_empty(`chart stacked-bar-chart ${/*customClass*/ ctx[13]}`) + " svelte-13righf"))) {
    				attr_dev(div1, "class", div1_class_value);
    			}

    			if (/*includeCaption*/ ctx[11]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*includeCaption*/ 2048) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$9(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div2, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty[0] & /*spanCol*/ 4096 && div2_class_value !== (div2_class_value = "" + (null_to_empty(`chart-wrapper ${/*spanCol*/ ctx[12] === 12
			? 'split-cols'
			: 'single-cols'}`) + " svelte-13righf"))) {
    				attr_dev(div2, "class", div2_class_value);
    			}

    			if (!current || dirty[0] & /*spanCol*/ 4096 && div2_style_value !== (div2_style_value = `--spanCol: ${/*spanCol*/ ctx[12]}`)) {
    				attr_dev(div2, "style", div2_style_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(layercake.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(layercake.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div2);
    			destroy_component(layercake);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const func$2 = d => d !== 'cluster';

    function instance$e($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('StackedBars', slots, []);
    	let { data } = $$props;
    	let { url } = $$props;
    	let { yKey } = $$props;
    	let { xKey } = $$props;
    	let { zKey } = $$props;
    	let { formatter = formatPct(0) } = $$props;
    	let { clusterLabelMap = labelMap } = $$props;
    	let { keyLabelMap = labelMap } = $$props;
    	let { clusterColorMap = colorMap } = $$props;
    	let { keyColorMap = colorMap } = $$props;
    	let { caption = 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eius, tempore?' } = $$props;
    	let { includeCaption = true } = $$props;
    	let { spanCol = 12 } = $$props;
    	let { customClass = 'chart-large' } = $$props;
    	let { tooltipType = 'arrow' } = $$props;
    	let { showLegend = false } = $$props;
    	const columns = data.columns.filter(d => d !== yKey);
    	const stacker = stack().keys(columns);
    	const stackedData = stacker(data);
    	let yDomain = enforceOrder(data.map(d => d[yKey]), prefOrder);
    	let zRange = Array.from(keyColorMap).filter(d => columns.includes(d[0])).map(d => d[1]);
    	let evt;
    	let hideTooltip = true;

    	const writable_props = [
    		'data',
    		'url',
    		'yKey',
    		'xKey',
    		'zKey',
    		'formatter',
    		'clusterLabelMap',
    		'keyLabelMap',
    		'clusterColorMap',
    		'keyColorMap',
    		'caption',
    		'includeCaption',
    		'spanCol',
    		'customClass',
    		'tooltipType',
    		'showLegend'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<StackedBars> was created with unknown prop '${key}'`);
    	});

    	const func_1 = d => clusterLabelMap.get(d);
    	const mousemove_handler = event => $$invalidate(15, evt = $$invalidate(16, hideTooltip = event));
    	const mouseout_handler = () => $$invalidate(16, hideTooltip = true);
    	const func_2 = d => d.data[yKey];

    	$$self.$$set = $$props => {
    		if ('data' in $$props) $$invalidate(0, data = $$props.data);
    		if ('url' in $$props) $$invalidate(1, url = $$props.url);
    		if ('yKey' in $$props) $$invalidate(2, yKey = $$props.yKey);
    		if ('xKey' in $$props) $$invalidate(3, xKey = $$props.xKey);
    		if ('zKey' in $$props) $$invalidate(4, zKey = $$props.zKey);
    		if ('formatter' in $$props) $$invalidate(5, formatter = $$props.formatter);
    		if ('clusterLabelMap' in $$props) $$invalidate(6, clusterLabelMap = $$props.clusterLabelMap);
    		if ('keyLabelMap' in $$props) $$invalidate(7, keyLabelMap = $$props.keyLabelMap);
    		if ('clusterColorMap' in $$props) $$invalidate(8, clusterColorMap = $$props.clusterColorMap);
    		if ('keyColorMap' in $$props) $$invalidate(9, keyColorMap = $$props.keyColorMap);
    		if ('caption' in $$props) $$invalidate(10, caption = $$props.caption);
    		if ('includeCaption' in $$props) $$invalidate(11, includeCaption = $$props.includeCaption);
    		if ('spanCol' in $$props) $$invalidate(12, spanCol = $$props.spanCol);
    		if ('customClass' in $$props) $$invalidate(13, customClass = $$props.customClass);
    		if ('tooltipType' in $$props) $$invalidate(14, tooltipType = $$props.tooltipType);
    		if ('showLegend' in $$props) $$invalidate(20, showLegend = $$props.showLegend);
    	};

    	$$self.$capture_state = () => ({
    		LayerCake,
    		Svg,
    		Html,
    		flatten,
    		scaleBand: band,
    		scaleOrdinal: ordinal,
    		stack,
    		BarStacked,
    		AxisY,
    		AxisX,
    		Tooltip,
    		Caption,
    		colorMap,
    		labelMap,
    		enforceOrder,
    		prefOrder,
    		formatPct,
    		data,
    		url,
    		yKey,
    		xKey,
    		zKey,
    		formatter,
    		clusterLabelMap,
    		keyLabelMap,
    		clusterColorMap,
    		keyColorMap,
    		caption,
    		includeCaption,
    		spanCol,
    		customClass,
    		tooltipType,
    		showLegend,
    		columns,
    		stacker,
    		stackedData,
    		yDomain,
    		zRange,
    		evt,
    		hideTooltip
    	});

    	$$self.$inject_state = $$props => {
    		if ('data' in $$props) $$invalidate(0, data = $$props.data);
    		if ('url' in $$props) $$invalidate(1, url = $$props.url);
    		if ('yKey' in $$props) $$invalidate(2, yKey = $$props.yKey);
    		if ('xKey' in $$props) $$invalidate(3, xKey = $$props.xKey);
    		if ('zKey' in $$props) $$invalidate(4, zKey = $$props.zKey);
    		if ('formatter' in $$props) $$invalidate(5, formatter = $$props.formatter);
    		if ('clusterLabelMap' in $$props) $$invalidate(6, clusterLabelMap = $$props.clusterLabelMap);
    		if ('keyLabelMap' in $$props) $$invalidate(7, keyLabelMap = $$props.keyLabelMap);
    		if ('clusterColorMap' in $$props) $$invalidate(8, clusterColorMap = $$props.clusterColorMap);
    		if ('keyColorMap' in $$props) $$invalidate(9, keyColorMap = $$props.keyColorMap);
    		if ('caption' in $$props) $$invalidate(10, caption = $$props.caption);
    		if ('includeCaption' in $$props) $$invalidate(11, includeCaption = $$props.includeCaption);
    		if ('spanCol' in $$props) $$invalidate(12, spanCol = $$props.spanCol);
    		if ('customClass' in $$props) $$invalidate(13, customClass = $$props.customClass);
    		if ('tooltipType' in $$props) $$invalidate(14, tooltipType = $$props.tooltipType);
    		if ('showLegend' in $$props) $$invalidate(20, showLegend = $$props.showLegend);
    		if ('yDomain' in $$props) $$invalidate(18, yDomain = $$props.yDomain);
    		if ('zRange' in $$props) $$invalidate(19, zRange = $$props.zRange);
    		if ('evt' in $$props) $$invalidate(15, evt = $$props.evt);
    		if ('hideTooltip' in $$props) $$invalidate(16, hideTooltip = $$props.hideTooltip);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		data,
    		url,
    		yKey,
    		xKey,
    		zKey,
    		formatter,
    		clusterLabelMap,
    		keyLabelMap,
    		clusterColorMap,
    		keyColorMap,
    		caption,
    		includeCaption,
    		spanCol,
    		customClass,
    		tooltipType,
    		evt,
    		hideTooltip,
    		stackedData,
    		yDomain,
    		zRange,
    		showLegend,
    		func_1,
    		mousemove_handler,
    		mouseout_handler,
    		func_2
    	];
    }

    class StackedBars extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$e,
    			create_fragment$e,
    			safe_not_equal,
    			{
    				data: 0,
    				url: 1,
    				yKey: 2,
    				xKey: 3,
    				zKey: 4,
    				formatter: 5,
    				clusterLabelMap: 6,
    				keyLabelMap: 7,
    				clusterColorMap: 8,
    				keyColorMap: 9,
    				caption: 10,
    				includeCaption: 11,
    				spanCol: 12,
    				customClass: 13,
    				tooltipType: 14,
    				showLegend: 20
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "StackedBars",
    			options,
    			id: create_fragment$e.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*data*/ ctx[0] === undefined && !('data' in props)) {
    			console.warn("<StackedBars> was created without expected prop 'data'");
    		}

    		if (/*url*/ ctx[1] === undefined && !('url' in props)) {
    			console.warn("<StackedBars> was created without expected prop 'url'");
    		}

    		if (/*yKey*/ ctx[2] === undefined && !('yKey' in props)) {
    			console.warn("<StackedBars> was created without expected prop 'yKey'");
    		}

    		if (/*xKey*/ ctx[3] === undefined && !('xKey' in props)) {
    			console.warn("<StackedBars> was created without expected prop 'xKey'");
    		}

    		if (/*zKey*/ ctx[4] === undefined && !('zKey' in props)) {
    			console.warn("<StackedBars> was created without expected prop 'zKey'");
    		}
    	}

    	get data() {
    		throw new Error("<StackedBars>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<StackedBars>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get url() {
    		throw new Error("<StackedBars>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set url(value) {
    		throw new Error("<StackedBars>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get yKey() {
    		throw new Error("<StackedBars>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set yKey(value) {
    		throw new Error("<StackedBars>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xKey() {
    		throw new Error("<StackedBars>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xKey(value) {
    		throw new Error("<StackedBars>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get zKey() {
    		throw new Error("<StackedBars>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set zKey(value) {
    		throw new Error("<StackedBars>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get formatter() {
    		throw new Error("<StackedBars>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set formatter(value) {
    		throw new Error("<StackedBars>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get clusterLabelMap() {
    		throw new Error("<StackedBars>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set clusterLabelMap(value) {
    		throw new Error("<StackedBars>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get keyLabelMap() {
    		throw new Error("<StackedBars>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set keyLabelMap(value) {
    		throw new Error("<StackedBars>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get clusterColorMap() {
    		throw new Error("<StackedBars>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set clusterColorMap(value) {
    		throw new Error("<StackedBars>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get keyColorMap() {
    		throw new Error("<StackedBars>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set keyColorMap(value) {
    		throw new Error("<StackedBars>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get caption() {
    		throw new Error("<StackedBars>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set caption(value) {
    		throw new Error("<StackedBars>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get includeCaption() {
    		throw new Error("<StackedBars>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set includeCaption(value) {
    		throw new Error("<StackedBars>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get spanCol() {
    		throw new Error("<StackedBars>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set spanCol(value) {
    		throw new Error("<StackedBars>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get customClass() {
    		throw new Error("<StackedBars>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set customClass(value) {
    		throw new Error("<StackedBars>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tooltipType() {
    		throw new Error("<StackedBars>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tooltipType(value) {
    		throw new Error("<StackedBars>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get showLegend() {
    		throw new Error("<StackedBars>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set showLegend(value) {
    		throw new Error("<StackedBars>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    // node_modules

    function verticalSankey() {
        var sankey = {},
            nodeWidth = 24,
            nodePadding = 8, // was 8, needs to be much bigger. these numbers are actually overwritten in the html when we instantiate the viz!
            size = [1, 1],
            nodes = [],
            links = [];
      
        sankey.nodeWidth = function(_) {
          if (!arguments.length) return nodeWidth;
          nodeWidth = +_;
          return sankey;
        };
      
        sankey.nodePadding = function(_) {
          if (!arguments.length) return nodePadding;
          nodePadding = +_;
          return sankey;
        };
      
        sankey.nodes = function(_) {
          if (!arguments.length) return nodes;
          nodes = _;
          return sankey;
        };
      
        sankey.links = function(_) {
          if (!arguments.length) return links;
          links = _;
          return sankey;
        };
      
        sankey.size = function(_) {
          if (!arguments.length) return size;
          size = _;
          return sankey;
        };
      
        sankey.layout = function(iterations) {
          computeNodeLinks();
          computeNodeValues();
          
          // big changes here
          // change the order and depths (y pos) won't need iterations
          computeNodeDepths();
          computeNodeBreadths(iterations);
          
          computeLinkDepths();
          return sankey;
        };
      
        sankey.relayout = function() {
          computeLinkDepths();
          return sankey;
        };
      
        sankey.link = function() {
          var curvature = .5;
      
            // x0 = line start X
            // y0 = line start Y
            
            // x1 = line end X
            // y1 = line end Y
            
            // y2 = control point 1 (Y pos)
            // y3 = control point 2 (Y pos)
            
          function link(d) {
      
              // big changes here obviously, more comments to follow
              var x0 = d.source.x + d.sy + d.dy / 2,
                  x1 = d.target.x + d.ty + d.dy / 2,
                y0 = d.source.y + nodeWidth,
                y1 = d.target.y,
                yi = interpolateNumber(y0, y1),
                y2 = yi(curvature),
                y3 = yi(1 - curvature);
      
              // ToDo - nice to have - allow flow up or down! Plenty of use cases for starting at the bottom,
              // but main one is trickle down (economics, budgets etc), not up
              
            return "M" + x0 + "," + y0        // start (of SVG path)
                 + "C" + x0 + "," + y2      // CP1 (curve control point)
                 + " " + x1 + "," + y3      // CP2
                 + " " + x1 + "," + y1;       // end
          }
      
          link.curvature = function(_) {
            if (!arguments.length) return curvature;
            curvature = +_;
            return link;
          };
      
          return link;
        };
      
        // Populate the sourceLinks and targetLinks for each node.
        // Also, if the source and target are not objects, assume they are indices.
        function computeNodeLinks() {
          nodes.forEach(function(node) {
            node.sourceLinks = [];
            node.targetLinks = [];
          });

          links.forEach(function(link) {
            var source = link.source,
                target = link.target;
            if (typeof source === "number") source = link.source = nodes[link.source];
            if (typeof target === "number") target = link.target = nodes[link.target];
            source.sourceLinks.push(link);
            target.targetLinks.push(link);
          });
        }
      
        // Compute the value (size) of each node by summing the associated links.
        function computeNodeValues() {
          nodes.forEach(function(node) {
            node.value = Math.max(
              sum(node.sourceLinks, value),
              sum(node.targetLinks, value)
            );
          });
        }
      
        // take a grouping of the nodes - the vertical columns
        // there shouldnt be 8 - there will be more, the total number of 1st level sources
        // then iterate over them and give them an incrementing x
        // because the data structure is ALL nodes, just flattened, don't just apply at the top level
        // then everything should have an X
        // THEN, for the Y
        // do the same thing, this time on the grouping of 8! i.e. 8 different Y values, not loads of different ones!
        function computeNodeBreadths(iterations) {
            var nodesByBreadth = groups(nodes, function(d) { return d.y; })
              .map(function(d) { return d[1]; }); // values! we are using the values also as a way to seperate nodes (not just stroke width)?
      
            // this bit is actually the node sizes (widths)
            //var ky = (size[1] - (nodes.length - 1) * nodePadding) / sum(nodes, value)
            // this should be only source nodes surely (level 1)
            var ky = (size[0] - (nodesByBreadth[0].length - 1) * nodePadding) / sum(nodesByBreadth[0], value);
            // I'd like them to be much bigger, this calc doesn't seem to fill the space!?
      
            nodesByBreadth.forEach(function(nodes) {
              nodes.forEach(function(node, i) {
                node.x = i;
                node.dy = node.value * ky;
              });
            });
      
            links.forEach(function(link) {
                link.dy = link.value * ky;
            });
            
            resolveCollisions();
            
            for (var alpha = 1; iterations > 0; --iterations) {
              relaxLeftToRight(alpha);
              resolveCollisions();
                  
              relaxRightToLeft(alpha *= .99);
              resolveCollisions();
            }
            
            // these relax methods should probably be operating on one level of the nodes, not all!?
            
            function relaxLeftToRight(alpha) {
              nodesByBreadth.forEach(function(nodes, breadth) {
                  nodes.forEach(function(node) {
                      if (node.targetLinks.length) {
                          var y = sum(node.targetLinks, weightedSource) / sum(node.targetLinks, value);
                          node.x += (y - center(node)) * alpha;
                      }
                  });
              });
      
            function weightedSource(link) {
              return center(link.source) * link.value;
            }
          }
      
          function relaxRightToLeft(alpha) {
            nodesByBreadth.slice().reverse().forEach(function(nodes) {
              nodes.forEach(function(node) {
                if (node.sourceLinks.length) {
                  var y = sum(node.sourceLinks, weightedTarget) / sum(node.sourceLinks, value);
                  node.x += (y - center(node)) * alpha;
                }
              });
            });
      
            function weightedTarget(link) {
              return center(link.target) * link.value;
            }
          }
            
            function resolveCollisions() {
              nodesByBreadth.forEach(function(nodes) {
                  var node,
                  dy,
                  x0 = 0,
                  n = nodes.length,
                  i;
      
                  // Push any overlapping nodes right.
                  nodes.sort(ascendingDepth);
                  for (i = 0; i < n; ++i) {
                      node = nodes[i];
                      dy = x0 - node.x;
                      if (dy > 0) node.x += dy;
                      x0 = node.x + node.dy + nodePadding;
                  }
      
                  // If the rightmost node goes outside the bounds, push it left.
                  dy = x0 - nodePadding - size[0]; // was size[1]
                  if (dy > 0) {
                      x0 = node.x -= dy;
      
                      // Push any overlapping nodes left.
                      for (i = n - 2; i >= 0; --i) {
                          node = nodes[i];
                          dy = node.x + node.dy + nodePadding - x0; // was y0
                          if (dy > 0) node.x -= dy;
                              x0 = node.x;
                          }
                      }
                  });
              }
            
          function ascendingDepth(a, b) {
              //return a.y - b.y; // flows go up
              return b.x - a.x; // flows go down
              //return a.x - b.x;
          }
          }
          
        // this moves all end points (sinks!) to the most extreme bottom
        function moveSinksDown(y) {
          nodes.forEach(function(node) {
            if (!node.sourceLinks.length) {
              node.y = y - 1;
            }
          });
        }
      
        // shift their locations out to occupy the screen
        function scaleNodeBreadths(kx) {
          nodes.forEach(function(node) {
            node.y *= kx;
          });
        }
      
        function computeNodeDepths() {
              var remainingNodes = nodes,
              nextNodes,
              y = 0;
      
              while (remainingNodes.length) {
                nextNodes = [];
                remainingNodes.forEach(function(node) {
                  node.y = y;
                  //node.dx = nodeWidth;
                  node.sourceLinks.forEach(function(link) {
                    if (nextNodes.indexOf(link.target) < 0) {
                      nextNodes.push(link.target);
                    }
                  });
                });
                remainingNodes = nextNodes;
                ++y;
              }
      
              // move end points to the very bottom
              moveSinksDown(y);
          
              scaleNodeBreadths((size[1] - nodeWidth) / (y - 1));
          }
          
        // .ty is the offset in terms of node position of the link (target)
        function computeLinkDepths() {
          nodes.forEach(function(node) {
            node.sourceLinks.sort(ascendingTargetDepth);
            node.targetLinks.sort(ascendingSourceDepth);
          });
          nodes.forEach(function(node) {
            var sy = 0, ty = 0;
                //ty = node.dy;
            node.sourceLinks.forEach(function(link) {
              link.sy = sy;
              sy += link.dy;
            });
            node.targetLinks.forEach(function(link) {
                // this is simply saying, for each target, keep adding the width of the link
                // so what if it was the other way round. start with full width then subtract?
              link.ty = ty;
              ty += link.dy;
              //ty -= link.dy;
            });
          });
      
          function ascendingSourceDepth(a, b) {
            //return a.source.y - b.source.y;
              return a.source.x - b.source.x;
          }
      
          function ascendingTargetDepth(a, b) {
            //return a.target.y - b.target.y;
              return a.target.x - b.target.x;
          }
        }
      
        function center(node) {   
            return node.y + node.dy / 2;
        }
      
        function value(link) {
          return link.value;
        }
      
        return sankey;
      }

    /* src/components/graphs/atoms/Sankey.svelte generated by Svelte v3.49.0 */

    const file$c = "src/components/graphs/atoms/Sankey.svelte";

    function get_each_context$8(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[26] = list[i];
    	child_ctx[30] = i;
    	const constants_0 = /*d*/ child_ctx[26].id.split('_');
    	child_ctx[27] = constants_0[0];
    	child_ctx[28] = constants_0[1];
    	return child_ctx;
    }

    function get_each_context_1$6(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[26] = list[i];
    	return child_ctx;
    }

    // (72:8) {#each links as d}
    function create_each_block_1$6(ctx) {
    	let path;
    	let path_stroke_width_value;
    	let path_d_value;
    	let mounted;
    	let dispose;

    	function mouseover_handler(...args) {
    		return /*mouseover_handler*/ ctx[21](/*d*/ ctx[26], ...args);
    	}

    	function focus_handler(...args) {
    		return /*focus_handler*/ ctx[22](/*d*/ ctx[26], ...args);
    	}

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			attr_dev(path, "class", "link svelte-1eqkavw");
    			attr_dev(path, "stroke-width", path_stroke_width_value = /*d*/ ctx[26].dy);
    			attr_dev(path, "d", path_d_value = /*link*/ ctx[6](/*d*/ ctx[26]));
    			set_style(path, "--color", /*colorLinks*/ ctx[0](/*d*/ ctx[26].sourceName));
    			add_location(path, file$c, 72, 12, 2844);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, path, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(path, "mouseover", mouseover_handler, false, false, false),
    					listen_dev(path, "focus", focus_handler, false, false, false),
    					listen_dev(path, "mouseout", /*mouseout_handler*/ ctx[23], false, false, false),
    					listen_dev(path, "blur", /*blur_handler*/ ctx[24], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty[0] & /*links*/ 128 && path_stroke_width_value !== (path_stroke_width_value = /*d*/ ctx[26].dy)) {
    				attr_dev(path, "stroke-width", path_stroke_width_value);
    			}

    			if (dirty[0] & /*link, links*/ 192 && path_d_value !== (path_d_value = /*link*/ ctx[6](/*d*/ ctx[26]))) {
    				attr_dev(path, "d", path_d_value);
    			}

    			if (dirty[0] & /*colorLinks, links*/ 129) {
    				set_style(path, "--color", /*colorLinks*/ ctx[0](/*d*/ ctx[26].sourceName));
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(path);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$6.name,
    		type: "each",
    		source: "(72:8) {#each links as d}",
    		ctx
    	});

    	return block;
    }

    // (86:8) {#each nodes as d, i}
    function create_each_block$8(ctx) {
    	let g;
    	let rect;
    	let rect_class_value;
    	let rect_x_value;
    	let rect_y_value;
    	let rect_width_value;
    	let rect_fill_value;
    	let text_1;
    	let t_value = /*labelNodes*/ ctx[2](/*cluster*/ ctx[28]) + "";
    	let t;
    	let text_1_x_value;
    	let text_1_y_value;
    	let text_1_dy_value;

    	const block = {
    		c: function create() {
    			g = svg_element("g");
    			rect = svg_element("rect");
    			text_1 = svg_element("text");
    			t = text$1(t_value);
    			attr_dev(rect, "class", rect_class_value = "" + (null_to_empty(`node node-${/*type*/ ctx[27]}`) + " svelte-1eqkavw"));
    			attr_dev(rect, "x", rect_x_value = /*d*/ ctx[26].x);

    			attr_dev(rect, "y", rect_y_value = /*d*/ ctx[26].y + (/*type*/ ctx[27] === 'source'
    			? /*sankeyGen*/ ctx[4].nodeWidth() - 7.5
    			: 0));

    			attr_dev(rect, "height", 7.5);
    			attr_dev(rect, "width", rect_width_value = /*d*/ ctx[26].dy);
    			attr_dev(rect, "fill", rect_fill_value = /*colorNodes*/ ctx[1](/*cluster*/ ctx[28]));
    			add_location(rect, file$c, 88, 16, 3431);
    			attr_dev(text_1, "class", "label svelte-1eqkavw");
    			attr_dev(text_1, "x", text_1_x_value = /*d*/ ctx[26].x + /*d*/ ctx[26].dy / 2);
    			attr_dev(text_1, "y", text_1_y_value = /*d*/ ctx[26].y + (/*type*/ ctx[27] === 'source' ? -2.5 : 2.5));
    			attr_dev(text_1, "dy", text_1_dy_value = /*sankeyGen*/ ctx[4].nodeWidth() / 2 + /*fontSize*/ ctx[5] / 2 - 2);
    			set_style(text_1, "fill", /*colorText*/ ctx[3](/*d*/ ctx[26]));
    			set_style(text_1, "font-size", /*fontSize*/ ctx[5] + "px");
    			add_location(text_1, file$c, 96, 16, 3746);
    			attr_dev(g, "class", "node-group");
    			add_location(g, file$c, 87, 12, 3392);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, g, anchor);
    			append_dev(g, rect);
    			append_dev(g, text_1);
    			append_dev(text_1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*nodes*/ 256 && rect_class_value !== (rect_class_value = "" + (null_to_empty(`node node-${/*type*/ ctx[27]}`) + " svelte-1eqkavw"))) {
    				attr_dev(rect, "class", rect_class_value);
    			}

    			if (dirty[0] & /*nodes*/ 256 && rect_x_value !== (rect_x_value = /*d*/ ctx[26].x)) {
    				attr_dev(rect, "x", rect_x_value);
    			}

    			if (dirty[0] & /*nodes, sankeyGen*/ 272 && rect_y_value !== (rect_y_value = /*d*/ ctx[26].y + (/*type*/ ctx[27] === 'source'
    			? /*sankeyGen*/ ctx[4].nodeWidth() - 7.5
    			: 0))) {
    				attr_dev(rect, "y", rect_y_value);
    			}

    			if (dirty[0] & /*nodes*/ 256 && rect_width_value !== (rect_width_value = /*d*/ ctx[26].dy)) {
    				attr_dev(rect, "width", rect_width_value);
    			}

    			if (dirty[0] & /*colorNodes, nodes*/ 258 && rect_fill_value !== (rect_fill_value = /*colorNodes*/ ctx[1](/*cluster*/ ctx[28]))) {
    				attr_dev(rect, "fill", rect_fill_value);
    			}

    			if (dirty[0] & /*labelNodes, nodes*/ 260 && t_value !== (t_value = /*labelNodes*/ ctx[2](/*cluster*/ ctx[28]) + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*nodes*/ 256 && text_1_x_value !== (text_1_x_value = /*d*/ ctx[26].x + /*d*/ ctx[26].dy / 2)) {
    				attr_dev(text_1, "x", text_1_x_value);
    			}

    			if (dirty[0] & /*nodes*/ 256 && text_1_y_value !== (text_1_y_value = /*d*/ ctx[26].y + (/*type*/ ctx[27] === 'source' ? -2.5 : 2.5))) {
    				attr_dev(text_1, "y", text_1_y_value);
    			}

    			if (dirty[0] & /*sankeyGen, fontSize*/ 48 && text_1_dy_value !== (text_1_dy_value = /*sankeyGen*/ ctx[4].nodeWidth() / 2 + /*fontSize*/ ctx[5] / 2 - 2)) {
    				attr_dev(text_1, "dy", text_1_dy_value);
    			}

    			if (dirty[0] & /*colorText, nodes*/ 264) {
    				set_style(text_1, "fill", /*colorText*/ ctx[3](/*d*/ ctx[26]));
    			}

    			if (dirty[0] & /*fontSize*/ 32) {
    				set_style(text_1, "font-size", /*fontSize*/ ctx[5] + "px");
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(g);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$8.name,
    		type: "each",
    		source: "(86:8) {#each nodes as d, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let g2;
    	let g0;
    	let g1;
    	let each_value_1 = /*links*/ ctx[7];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1$6(get_each_context_1$6(ctx, each_value_1, i));
    	}

    	let each_value = /*nodes*/ ctx[8];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$8(get_each_context$8(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			g2 = svg_element("g");
    			g0 = svg_element("g");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			g1 = svg_element("g");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(g0, "class", "link-group");
    			add_location(g0, file$c, 70, 4, 2782);
    			attr_dev(g1, "class", "rect-group");
    			add_location(g1, file$c, 84, 4, 3270);
    			attr_dev(g2, "class", "sankey-layer");
    			add_location(g2, file$c, 69, 0, 2753);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, g2, anchor);
    			append_dev(g2, g0);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(g0, null);
    			}

    			append_dev(g2, g1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(g1, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*links, link, colorLinks, handleMouseOver, handleMouseOut*/ 12481) {
    				each_value_1 = /*links*/ ctx[7];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$6(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1$6(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(g0, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty[0] & /*nodes, sankeyGen, fontSize, colorText, labelNodes, colorNodes*/ 318) {
    				each_value = /*nodes*/ ctx[8];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$8(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$8(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(g1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(g2);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let sankeyGen;
    	let nodes;
    	let links;
    	let link;
    	let fontSize;
    	let $width;
    	let $data;
    	let $height;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Sankey', slots, []);
    	const { data, width, height } = getContext('LayerCake');
    	validate_store(data, 'data');
    	component_subscribe($$self, data, value => $$invalidate(19, $data = value));
    	validate_store(width, 'width');
    	component_subscribe($$self, width, value => $$invalidate(18, $width = value));
    	validate_store(height, 'height');
    	component_subscribe($$self, height, value => $$invalidate(20, $height = value));
    	let { colorLinks = d => 'rgba(0, 0, 0, .2)' } = $$props;
    	let { colorNodes = d => '#333' } = $$props;
    	let { labelNodes = d => d } = $$props;
    	let { colorText = d => '#263238' } = $$props;
    	let { nodeWidth = 5 } = $$props;
    	let { nodePadding = 10 } = $$props;
    	let { linkSort = null } = $$props;
    	let { nodeId = d => d.id } = $$props;
    	const dispatch = createEventDispatcher();

    	function handleMouseOver(e, d) {
    		dispatch('mousemove', { e, props: d });

    		document.querySelectorAll('.link').forEach(el => {
    			if (el !== e.target) el.classList.add('inactive'); else el.classList.add('active');
    		});
    	}

    	function handleMouseOut(e) {
    		dispatch('mouseout');
    		document.querySelectorAll('.link').forEach(el => el.classList.remove('inactive'));
    		e.target.classList.remove('active');
    	}

    	const writable_props = [
    		'colorLinks',
    		'colorNodes',
    		'labelNodes',
    		'colorText',
    		'nodeWidth',
    		'nodePadding',
    		'linkSort',
    		'nodeId'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Sankey> was created with unknown prop '${key}'`);
    	});

    	const mouseover_handler = (d, e) => handleMouseOver(e, d);
    	const focus_handler = (d, e) => handleMouseOver(e, d);
    	const mouseout_handler = e => handleMouseOut(e);
    	const blur_handler = e => handleMouseOut(e);

    	$$self.$$set = $$props => {
    		if ('colorLinks' in $$props) $$invalidate(0, colorLinks = $$props.colorLinks);
    		if ('colorNodes' in $$props) $$invalidate(1, colorNodes = $$props.colorNodes);
    		if ('labelNodes' in $$props) $$invalidate(2, labelNodes = $$props.labelNodes);
    		if ('colorText' in $$props) $$invalidate(3, colorText = $$props.colorText);
    		if ('nodeWidth' in $$props) $$invalidate(14, nodeWidth = $$props.nodeWidth);
    		if ('nodePadding' in $$props) $$invalidate(15, nodePadding = $$props.nodePadding);
    		if ('linkSort' in $$props) $$invalidate(16, linkSort = $$props.linkSort);
    		if ('nodeId' in $$props) $$invalidate(17, nodeId = $$props.nodeId);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		createEventDispatcher,
    		verticalSankey,
    		data,
    		width,
    		height,
    		colorLinks,
    		colorNodes,
    		labelNodes,
    		colorText,
    		nodeWidth,
    		nodePadding,
    		linkSort,
    		nodeId,
    		dispatch,
    		handleMouseOver,
    		handleMouseOut,
    		fontSize,
    		sankeyGen,
    		link,
    		links,
    		nodes,
    		$width,
    		$data,
    		$height
    	});

    	$$self.$inject_state = $$props => {
    		if ('colorLinks' in $$props) $$invalidate(0, colorLinks = $$props.colorLinks);
    		if ('colorNodes' in $$props) $$invalidate(1, colorNodes = $$props.colorNodes);
    		if ('labelNodes' in $$props) $$invalidate(2, labelNodes = $$props.labelNodes);
    		if ('colorText' in $$props) $$invalidate(3, colorText = $$props.colorText);
    		if ('nodeWidth' in $$props) $$invalidate(14, nodeWidth = $$props.nodeWidth);
    		if ('nodePadding' in $$props) $$invalidate(15, nodePadding = $$props.nodePadding);
    		if ('linkSort' in $$props) $$invalidate(16, linkSort = $$props.linkSort);
    		if ('nodeId' in $$props) $$invalidate(17, nodeId = $$props.nodeId);
    		if ('fontSize' in $$props) $$invalidate(5, fontSize = $$props.fontSize);
    		if ('sankeyGen' in $$props) $$invalidate(4, sankeyGen = $$props.sankeyGen);
    		if ('link' in $$props) $$invalidate(6, link = $$props.link);
    		if ('links' in $$props) $$invalidate(7, links = $$props.links);
    		if ('nodes' in $$props) $$invalidate(8, nodes = $$props.nodes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*$width, $height, $data*/ 1835008) {
    			/** @type {Function} [nodeAlign=d3.sankeyLeft] - An alignment function to position the Sankey blocks. See the [d3-sankey documentation](https://github.com/d3/d3-sankey#alignments) for more. */
    			// export let nodeAlign = sankeyLeft;
    			$$invalidate(4, sankeyGen = verticalSankey().nodeWidth(25).nodePadding(5).size([$width, $height]).nodes($data.nodes).links($data.links).layout(0));
    		}

    		if ($$self.$$.dirty[0] & /*sankeyGen*/ 16) {
    			$$invalidate(8, nodes = sankeyGen.nodes());
    		}

    		if ($$self.$$.dirty[0] & /*sankeyGen*/ 16) {
    			$$invalidate(7, links = sankeyGen.links());
    		}

    		if ($$self.$$.dirty[0] & /*sankeyGen*/ 16) {
    			$$invalidate(6, link = sankeyGen.link());
    		}

    		if ($$self.$$.dirty[0] & /*$width*/ 262144) {
    			$$invalidate(5, fontSize = $width <= 320 ? 8 : 12);
    		}
    	};

    	return [
    		colorLinks,
    		colorNodes,
    		labelNodes,
    		colorText,
    		sankeyGen,
    		fontSize,
    		link,
    		links,
    		nodes,
    		data,
    		width,
    		height,
    		handleMouseOver,
    		handleMouseOut,
    		nodeWidth,
    		nodePadding,
    		linkSort,
    		nodeId,
    		$width,
    		$data,
    		$height,
    		mouseover_handler,
    		focus_handler,
    		mouseout_handler,
    		blur_handler
    	];
    }

    class Sankey extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$d,
    			create_fragment$d,
    			safe_not_equal,
    			{
    				colorLinks: 0,
    				colorNodes: 1,
    				labelNodes: 2,
    				colorText: 3,
    				nodeWidth: 14,
    				nodePadding: 15,
    				linkSort: 16,
    				nodeId: 17
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Sankey",
    			options,
    			id: create_fragment$d.name
    		});
    	}

    	get colorLinks() {
    		throw new Error("<Sankey>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set colorLinks(value) {
    		throw new Error("<Sankey>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get colorNodes() {
    		throw new Error("<Sankey>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set colorNodes(value) {
    		throw new Error("<Sankey>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get labelNodes() {
    		throw new Error("<Sankey>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labelNodes(value) {
    		throw new Error("<Sankey>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get colorText() {
    		throw new Error("<Sankey>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set colorText(value) {
    		throw new Error("<Sankey>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get nodeWidth() {
    		throw new Error("<Sankey>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set nodeWidth(value) {
    		throw new Error("<Sankey>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get nodePadding() {
    		throw new Error("<Sankey>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set nodePadding(value) {
    		throw new Error("<Sankey>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get linkSort() {
    		throw new Error("<Sankey>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set linkSort(value) {
    		throw new Error("<Sankey>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get nodeId() {
    		throw new Error("<Sankey>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set nodeId(value) {
    		throw new Error("<Sankey>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/graphs/atoms/SankeyLabels.svelte generated by Svelte v3.49.0 */
    const file$b = "src/components/graphs/atoms/SankeyLabels.svelte";

    function create_fragment$c(ctx) {
    	let div0;
    	let t0;
    	let t1;
    	let div1;
    	let t2;

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t0 = text$1(/*source*/ ctx[0]);
    			t1 = space();
    			div1 = element("div");
    			t2 = text$1(/*target*/ ctx[1]);
    			attr_dev(div0, "class", "sankey-label source svelte-1xhqv90");
    			set_style(div0, "--padding-top", "-" + /*$padding*/ ctx[2].top + "px");
    			add_location(div0, file$b, 6, 0, 156);
    			attr_dev(div1, "class", "sankey-label target svelte-1xhqv90");
    			set_style(div1, "--padding-bottom", "-" + /*$padding*/ ctx[2].bottom + "px");
    			add_location(div1, file$b, 9, 0, 253);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, t2);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*source*/ 1) set_data_dev(t0, /*source*/ ctx[0]);

    			if (dirty & /*$padding*/ 4) {
    				set_style(div0, "--padding-top", "-" + /*$padding*/ ctx[2].top + "px");
    			}

    			if (dirty & /*target*/ 2) set_data_dev(t2, /*target*/ ctx[1]);

    			if (dirty & /*$padding*/ 4) {
    				set_style(div1, "--padding-bottom", "-" + /*$padding*/ ctx[2].bottom + "px");
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let $padding;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SankeyLabels', slots, []);
    	let { source } = $$props;
    	let { target } = $$props;
    	const { width, padding } = getContext('LayerCake');
    	validate_store(padding, 'padding');
    	component_subscribe($$self, padding, value => $$invalidate(2, $padding = value));
    	const writable_props = ['source', 'target'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SankeyLabels> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('source' in $$props) $$invalidate(0, source = $$props.source);
    		if ('target' in $$props) $$invalidate(1, target = $$props.target);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		source,
    		target,
    		width,
    		padding,
    		$padding
    	});

    	$$self.$inject_state = $$props => {
    		if ('source' in $$props) $$invalidate(0, source = $$props.source);
    		if ('target' in $$props) $$invalidate(1, target = $$props.target);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [source, target, $padding, padding];
    }

    class SankeyLabels extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, { source: 0, target: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SankeyLabels",
    			options,
    			id: create_fragment$c.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*source*/ ctx[0] === undefined && !('source' in props)) {
    			console.warn("<SankeyLabels> was created without expected prop 'source'");
    		}

    		if (/*target*/ ctx[1] === undefined && !('target' in props)) {
    			console.warn("<SankeyLabels> was created without expected prop 'target'");
    		}
    	}

    	get source() {
    		throw new Error("<SankeyLabels>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set source(value) {
    		throw new Error("<SankeyLabels>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get target() {
    		throw new Error("<SankeyLabels>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set target(value) {
    		throw new Error("<SankeyLabels>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/graphs/SankeyDiagram.svelte generated by Svelte v3.49.0 */
    const file$a = "src/components/graphs/SankeyDiagram.svelte";

    function get_context$2(ctx) {
    	const constants_0 = { .../*detail*/ ctx[16].props };
    	ctx[17] = constants_0;
    }

    function get_each_context$7(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[18] = list[i];
    	const constants_0 = /*tooltipData*/ child_ctx[17][/*key*/ child_ctx[18]];
    	child_ctx[19] = constants_0;
    	return child_ctx;
    }

    // (35:12) <Svg>
    function create_default_slot_3$1(ctx) {
    	let defs;
    	let linearGradient;
    	let stop0;
    	let stop1;
    	let t;
    	let sankey;
    	let current;

    	sankey = new Sankey({
    			props: {
    				colorNodes: /*func*/ ctx[11],
    				labelNodes: /*func_1*/ ctx[12],
    				colorLinks: /*func_2*/ ctx[13]
    			},
    			$$inline: true
    		});

    	sankey.$on("mousemove", /*mousemove_handler*/ ctx[14]);
    	sankey.$on("mouseout", /*mouseout_handler*/ ctx[15]);

    	const block = {
    		c: function create() {
    			defs = svg_element("defs");
    			linearGradient = svg_element("linearGradient");
    			stop0 = svg_element("stop");
    			stop1 = svg_element("stop");
    			t = space();
    			create_component(sankey.$$.fragment);
    			attr_dev(stop0, "offset", "0");
    			attr_dev(stop0, "stop-color", "var(--color-source)");
    			add_location(stop0, file$a, 37, 24, 1261);
    			attr_dev(stop1, "offset", "100%");
    			attr_dev(stop1, "stop-color", "var(--color-target)");
    			add_location(stop1, file$a, 38, 24, 1338);
    			attr_dev(linearGradient, "id", "gradient");
    			attr_dev(linearGradient, "gradientTransform", "rotate(90)");
    			add_location(linearGradient, file$a, 36, 20, 1175);
    			add_location(defs, file$a, 35, 16, 1148);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, defs, anchor);
    			append_dev(defs, linearGradient);
    			append_dev(linearGradient, stop0);
    			append_dev(linearGradient, stop1);
    			insert_dev(target, t, anchor);
    			mount_component(sankey, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sankey.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sankey.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(defs);
    			if (detaching) detach_dev(t);
    			destroy_component(sankey, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$1.name,
    		type: "slot",
    		source: "(35:12) <Svg>",
    		ctx
    	});

    	return block;
    }

    // (54:16) {#if hideTooltip !== true}
    function create_if_block_1$3(ctx) {
    	let tooltip;
    	let current;

    	tooltip = new Tooltip({
    			props: {
    				evt: /*evt*/ ctx[9],
    				offset: -10,
    				$$slots: {
    					default: [
    						create_default_slot_2$2,
    						({ detail }) => ({ 16: detail }),
    						({ detail }) => detail ? 65536 : 0
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(tooltip.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(tooltip, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const tooltip_changes = {};
    			if (dirty & /*evt*/ 512) tooltip_changes.evt = /*evt*/ ctx[9];

    			if (dirty & /*$$scope, formatter, detail*/ 4259848) {
    				tooltip_changes.$$scope = { dirty, ctx };
    			}

    			tooltip.$set(tooltip_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tooltip.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tooltip.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tooltip, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(54:16) {#if hideTooltip !== true}",
    		ctx
    	});

    	return block;
    }

    // (75:24) {#each ['value'] as key}
    function create_each_block$7(ctx) {
    	let div;
    	let t_value = /*formatter*/ ctx[3](/*value*/ ctx[19]) + "";
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text$1(t_value);
    			attr_dev(div, "class", "row");
    			add_location(div, file$a, 76, 28, 3051);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*formatter, detail*/ 65544 && t_value !== (t_value = /*formatter*/ ctx[3](/*value*/ ctx[19]) + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$7.name,
    		type: "each",
    		source: "(75:24) {#each ['value'] as key}",
    		ctx
    	});

    	return block;
    }

    // (55:20) <Tooltip                         {evt}                         offset={-10}                         let:detail                     >
    function create_default_slot_2$2(ctx) {
    	get_context$2(ctx);
    	let div;
    	let span0;
    	let t0_value = labelMap.get(/*tooltipData*/ ctx[17].sourceName) + "";
    	let t0;
    	let t1;
    	let span1;
    	let t2_value = labelMap.get(/*tooltipData*/ ctx[17].targetName) + "";
    	let t2;
    	let t3;
    	let each_1_anchor;
    	let each_value = ['value'];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < 1; i += 1) {
    		each_blocks[i] = create_each_block$7(get_each_context$7(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			span0 = element("span");
    			t0 = text$1(t0_value);
    			t1 = text$1(" ➞\n                            ");
    			span1 = element("span");
    			t2 = text$1(t2_value);
    			t3 = space();

    			for (let i = 0; i < 1; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    			attr_dev(span0, "class", "cluster-label svelte-13lgr7s");
    			set_style(span0, "--color", colorMap.get(/*tooltipData*/ ctx[17].sourceName));
    			add_location(span0, file$a, 61, 28, 2279);
    			attr_dev(span1, "class", "cluster-label svelte-13lgr7s");
    			set_style(span1, "--color", colorMap.get(/*tooltipData*/ ctx[17].targetName));
    			add_location(span1, file$a, 67, 28, 2596);
    			add_location(div, file$a, 60, 24, 2245);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span0);
    			append_dev(span0, t0);
    			append_dev(div, t1);
    			append_dev(div, span1);
    			append_dev(span1, t2);
    			insert_dev(target, t3, anchor);

    			for (let i = 0; i < 1; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			get_context$2(ctx);
    			if (dirty & /*detail*/ 65536 && t0_value !== (t0_value = labelMap.get(/*tooltipData*/ ctx[17].sourceName) + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*detail*/ 65536) {
    				set_style(span0, "--color", colorMap.get(/*tooltipData*/ ctx[17].sourceName));
    			}

    			if (dirty & /*detail*/ 65536 && t2_value !== (t2_value = labelMap.get(/*tooltipData*/ ctx[17].targetName) + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*detail*/ 65536) {
    				set_style(span1, "--color", colorMap.get(/*tooltipData*/ ctx[17].targetName));
    			}

    			if (dirty & /*formatter, detail*/ 65544) {
    				each_value = ['value'];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < 1; i += 1) {
    					const child_ctx = get_each_context$7(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$7(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < 1; i += 1) {
    					each_blocks[i].d(1);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t3);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$2.name,
    		type: "slot",
    		source: "(55:20) <Tooltip                         {evt}                         offset={-10}                         let:detail                     >",
    		ctx
    	});

    	return block;
    }

    // (50:12) <Html                 pointerEvents={false}             >
    function create_default_slot_1$2(ctx) {
    	let sankeylabels;
    	let t;
    	let if_block_anchor;
    	let current;

    	sankeylabels = new SankeyLabels({
    			props: {
    				source: /*sourceLabel*/ ctx[7],
    				target: /*targetLabel*/ ctx[8]
    			},
    			$$inline: true
    		});

    	let if_block = /*hideTooltip*/ ctx[10] !== true && create_if_block_1$3(ctx);

    	const block = {
    		c: function create() {
    			create_component(sankeylabels.$$.fragment);
    			t = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			mount_component(sankeylabels, target, anchor);
    			insert_dev(target, t, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const sankeylabels_changes = {};
    			if (dirty & /*sourceLabel*/ 128) sankeylabels_changes.source = /*sourceLabel*/ ctx[7];
    			if (dirty & /*targetLabel*/ 256) sankeylabels_changes.target = /*targetLabel*/ ctx[8];
    			sankeylabels.$set(sankeylabels_changes);

    			if (/*hideTooltip*/ ctx[10] !== true) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*hideTooltip*/ 1024) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1$3(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sankeylabels.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sankeylabels.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(sankeylabels, detaching);
    			if (detaching) detach_dev(t);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$2.name,
    		type: "slot",
    		source: "(50:12) <Html                 pointerEvents={false}             >",
    		ctx
    	});

    	return block;
    }

    // (27:8) <LayerCake             data={{ nodes, links }}             padding={{                 top: 30,                 bottom: 30             }}             position={'relative'}         >
    function create_default_slot$3(ctx) {
    	let svg;
    	let t;
    	let html;
    	let current;

    	svg = new Svg({
    			props: {
    				$$slots: { default: [create_default_slot_3$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	html = new Html({
    			props: {
    				pointerEvents: false,
    				$$slots: { default: [create_default_slot_1$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(svg.$$.fragment);
    			t = space();
    			create_component(html.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(svg, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(html, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const svg_changes = {};

    			if (dirty & /*$$scope, evt, hideTooltip*/ 4195840) {
    				svg_changes.$$scope = { dirty, ctx };
    			}

    			svg.$set(svg_changes);
    			const html_changes = {};

    			if (dirty & /*$$scope, evt, formatter, hideTooltip, sourceLabel, targetLabel*/ 4196232) {
    				html_changes.$$scope = { dirty, ctx };
    			}

    			html.$set(html_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(svg.$$.fragment, local);
    			transition_in(html.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(svg.$$.fragment, local);
    			transition_out(html.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(svg, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(html, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(27:8) <LayerCake             data={{ nodes, links }}             padding={{                 top: 30,                 bottom: 30             }}             position={'relative'}         >",
    		ctx
    	});

    	return block;
    }

    // (84:4) {#if includeCaption}
    function create_if_block$8(ctx) {
    	let caption_1;
    	let current;

    	caption_1 = new Caption({
    			props: {
    				caption: /*caption*/ ctx[4],
    				url: /*url*/ ctx[2],
    				type: /*spanCol*/ ctx[6] === 12 ? 'split-cols' : 'single-cols'
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(caption_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(caption_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const caption_1_changes = {};
    			if (dirty & /*caption*/ 16) caption_1_changes.caption = /*caption*/ ctx[4];
    			if (dirty & /*url*/ 4) caption_1_changes.url = /*url*/ ctx[2];
    			if (dirty & /*spanCol*/ 64) caption_1_changes.type = /*spanCol*/ ctx[6] === 12 ? 'split-cols' : 'single-cols';
    			caption_1.$set(caption_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(caption_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(caption_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(caption_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(84:4) {#if includeCaption}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let div1;
    	let div0;
    	let layercake;
    	let t;
    	let div1_class_value;
    	let div1_style_value;
    	let current;

    	layercake = new LayerCake({
    			props: {
    				data: {
    					nodes: /*nodes*/ ctx[0],
    					links: /*links*/ ctx[1]
    				},
    				padding: { top: 30, bottom: 30 },
    				position: 'relative',
    				$$slots: { default: [create_default_slot$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let if_block = /*includeCaption*/ ctx[5] && create_if_block$8(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			create_component(layercake.$$.fragment);
    			t = space();
    			if (if_block) if_block.c();
    			attr_dev(div0, "class", "chart sankey-diagram");
    			add_location(div0, file$a, 25, 4, 890);
    			attr_dev(div1, "class", div1_class_value = "" + (null_to_empty(`chart-wrapper ${/*spanCol*/ ctx[6] === 12 ? 'split-cols' : 'single-cols'}`) + " svelte-13lgr7s"));
    			attr_dev(div1, "style", div1_style_value = `--spanCol: ${/*spanCol*/ ctx[6]}`);
    			add_location(div1, file$a, 21, 0, 764);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			mount_component(layercake, div0, null);
    			append_dev(div1, t);
    			if (if_block) if_block.m(div1, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const layercake_changes = {};

    			if (dirty & /*nodes, links*/ 3) layercake_changes.data = {
    				nodes: /*nodes*/ ctx[0],
    				links: /*links*/ ctx[1]
    			};

    			if (dirty & /*$$scope, evt, formatter, hideTooltip, sourceLabel, targetLabel*/ 4196232) {
    				layercake_changes.$$scope = { dirty, ctx };
    			}

    			layercake.$set(layercake_changes);

    			if (/*includeCaption*/ ctx[5]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*includeCaption*/ 32) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$8(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div1, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*spanCol*/ 64 && div1_class_value !== (div1_class_value = "" + (null_to_empty(`chart-wrapper ${/*spanCol*/ ctx[6] === 12 ? 'split-cols' : 'single-cols'}`) + " svelte-13lgr7s"))) {
    				attr_dev(div1, "class", div1_class_value);
    			}

    			if (!current || dirty & /*spanCol*/ 64 && div1_style_value !== (div1_style_value = `--spanCol: ${/*spanCol*/ ctx[6]}`)) {
    				attr_dev(div1, "style", div1_style_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(layercake.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(layercake.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(layercake);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SankeyDiagram', slots, []);
    	let { nodes } = $$props;
    	let { links } = $$props;
    	let { url } = $$props;
    	let { formatter = formatPct(0) } = $$props;
    	let { caption = 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eius, tempore?' } = $$props;
    	let { includeCaption = true } = $$props;
    	let { spanCol = 12 } = $$props;
    	let { sourceLabel = 'Source' } = $$props;
    	let { targetLabel = 'Target' } = $$props;
    	let evt;
    	let hideTooltip = true;

    	const writable_props = [
    		'nodes',
    		'links',
    		'url',
    		'formatter',
    		'caption',
    		'includeCaption',
    		'spanCol',
    		'sourceLabel',
    		'targetLabel'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SankeyDiagram> was created with unknown prop '${key}'`);
    	});

    	const func = d => colorMap.get(d);
    	const func_1 = d => labelMap.get(d);
    	const func_2 = d => colorMap.get(d);
    	const mousemove_handler = event => $$invalidate(9, evt = $$invalidate(10, hideTooltip = event));
    	const mouseout_handler = () => $$invalidate(10, hideTooltip = true);

    	$$self.$$set = $$props => {
    		if ('nodes' in $$props) $$invalidate(0, nodes = $$props.nodes);
    		if ('links' in $$props) $$invalidate(1, links = $$props.links);
    		if ('url' in $$props) $$invalidate(2, url = $$props.url);
    		if ('formatter' in $$props) $$invalidate(3, formatter = $$props.formatter);
    		if ('caption' in $$props) $$invalidate(4, caption = $$props.caption);
    		if ('includeCaption' in $$props) $$invalidate(5, includeCaption = $$props.includeCaption);
    		if ('spanCol' in $$props) $$invalidate(6, spanCol = $$props.spanCol);
    		if ('sourceLabel' in $$props) $$invalidate(7, sourceLabel = $$props.sourceLabel);
    		if ('targetLabel' in $$props) $$invalidate(8, targetLabel = $$props.targetLabel);
    	};

    	$$self.$capture_state = () => ({
    		LayerCake,
    		Svg,
    		Html,
    		Sankey,
    		Tooltip,
    		SankeyLabels,
    		Caption,
    		colorMap,
    		labelMap,
    		formatPct,
    		nodes,
    		links,
    		url,
    		formatter,
    		caption,
    		includeCaption,
    		spanCol,
    		sourceLabel,
    		targetLabel,
    		evt,
    		hideTooltip
    	});

    	$$self.$inject_state = $$props => {
    		if ('nodes' in $$props) $$invalidate(0, nodes = $$props.nodes);
    		if ('links' in $$props) $$invalidate(1, links = $$props.links);
    		if ('url' in $$props) $$invalidate(2, url = $$props.url);
    		if ('formatter' in $$props) $$invalidate(3, formatter = $$props.formatter);
    		if ('caption' in $$props) $$invalidate(4, caption = $$props.caption);
    		if ('includeCaption' in $$props) $$invalidate(5, includeCaption = $$props.includeCaption);
    		if ('spanCol' in $$props) $$invalidate(6, spanCol = $$props.spanCol);
    		if ('sourceLabel' in $$props) $$invalidate(7, sourceLabel = $$props.sourceLabel);
    		if ('targetLabel' in $$props) $$invalidate(8, targetLabel = $$props.targetLabel);
    		if ('evt' in $$props) $$invalidate(9, evt = $$props.evt);
    		if ('hideTooltip' in $$props) $$invalidate(10, hideTooltip = $$props.hideTooltip);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		nodes,
    		links,
    		url,
    		formatter,
    		caption,
    		includeCaption,
    		spanCol,
    		sourceLabel,
    		targetLabel,
    		evt,
    		hideTooltip,
    		func,
    		func_1,
    		func_2,
    		mousemove_handler,
    		mouseout_handler
    	];
    }

    class SankeyDiagram extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {
    			nodes: 0,
    			links: 1,
    			url: 2,
    			formatter: 3,
    			caption: 4,
    			includeCaption: 5,
    			spanCol: 6,
    			sourceLabel: 7,
    			targetLabel: 8
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SankeyDiagram",
    			options,
    			id: create_fragment$b.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*nodes*/ ctx[0] === undefined && !('nodes' in props)) {
    			console.warn("<SankeyDiagram> was created without expected prop 'nodes'");
    		}

    		if (/*links*/ ctx[1] === undefined && !('links' in props)) {
    			console.warn("<SankeyDiagram> was created without expected prop 'links'");
    		}

    		if (/*url*/ ctx[2] === undefined && !('url' in props)) {
    			console.warn("<SankeyDiagram> was created without expected prop 'url'");
    		}
    	}

    	get nodes() {
    		throw new Error("<SankeyDiagram>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set nodes(value) {
    		throw new Error("<SankeyDiagram>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get links() {
    		throw new Error("<SankeyDiagram>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set links(value) {
    		throw new Error("<SankeyDiagram>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get url() {
    		throw new Error("<SankeyDiagram>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set url(value) {
    		throw new Error("<SankeyDiagram>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get formatter() {
    		throw new Error("<SankeyDiagram>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set formatter(value) {
    		throw new Error("<SankeyDiagram>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get caption() {
    		throw new Error("<SankeyDiagram>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set caption(value) {
    		throw new Error("<SankeyDiagram>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get includeCaption() {
    		throw new Error("<SankeyDiagram>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set includeCaption(value) {
    		throw new Error("<SankeyDiagram>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get spanCol() {
    		throw new Error("<SankeyDiagram>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set spanCol(value) {
    		throw new Error("<SankeyDiagram>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get sourceLabel() {
    		throw new Error("<SankeyDiagram>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sourceLabel(value) {
    		throw new Error("<SankeyDiagram>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get targetLabel() {
    		throw new Error("<SankeyDiagram>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set targetLabel(value) {
    		throw new Error("<SankeyDiagram>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/main/Section3.svelte generated by Svelte v3.49.0 */
    const file$9 = "src/components/main/Section3.svelte";

    function get_each_context$6(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	child_ctx[10] = i;
    	return child_ctx;
    }

    function get_each_context_1$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	child_ctx[10] = i;
    	return child_ctx;
    }

    // (39:4) {:else}
    function create_else_block$4(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "chart-placeholder svelte-1kekzne");
    			add_location(div, file$9, 38, 12, 1257);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(39:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (26:4) {#if loaded && data_fig1}
    function create_if_block$7(ctx) {
    	let stackedbars;
    	let current;

    	stackedbars = new StackedBars({
    			props: {
    				data: /*data_fig1*/ ctx[2],
    				yKey: /*yKey*/ ctx[5],
    				xKey: /*xKey*/ ctx[4],
    				zKey: /*zKey*/ ctx[6],
    				formatter: formatPct(2),
    				url: /*url_fig1*/ ctx[3],
    				spanCol: 12,
    				customClass: 'chart-medium',
    				tooltipType: 'community',
    				caption: 'The archetypes of news consumption behavior on YouTube for each political category.'
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(stackedbars.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(stackedbars, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const stackedbars_changes = {};
    			if (dirty & /*data_fig1*/ 4) stackedbars_changes.data = /*data_fig1*/ ctx[2];
    			stackedbars.$set(stackedbars_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(stackedbars.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(stackedbars.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(stackedbars, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(26:4) {#if loaded && data_fig1}",
    		ctx
    	});

    	return block;
    }

    // (42:8) {#each copy['section-two']['copy'] as d, i}
    function create_each_block_1$5(ctx) {
    	let p;
    	let t0_value = /*d*/ ctx[8].value + "";
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text$1(t0_value);
    			t1 = space();
    			add_location(p, file$9, 42, 12, 1392);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$5.name,
    		type: "each",
    		source: "(42:8) {#each copy['section-two']['copy'] as d, i}",
    		ctx
    	});

    	return block;
    }

    // (49:8) {#each copy['section-two']['references'] as d, i}
    function create_each_block$6(ctx) {
    	let p;
    	let t0_value = /*d*/ ctx[8].value + "";
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text$1(t0_value);
    			t1 = space();
    			add_location(p, file$9, 49, 12, 1565);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$6.name,
    		type: "each",
    		source: "(49:8) {#each copy['section-two']['references'] as d, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let div2;
    	let h2;
    	let t1;
    	let current_block_type_index;
    	let if_block;
    	let t2;
    	let div0;
    	let t3;
    	let div1;
    	let inView_action;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block$7, create_else_block$4];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*loaded*/ ctx[1] && /*data_fig1*/ ctx[2]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	let each_value_1 = data['section-two']['copy'];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1$5(get_each_context_1$5(ctx, each_value_1, i));
    	}

    	let each_value = data['section-two']['references'];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$6(get_each_context$6(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			h2 = element("h2");
    			h2.textContent = "Subtitle 1";
    			t1 = space();
    			if_block.c();
    			t2 = space();
    			div0 = element("div");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t3 = space();
    			div1 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(h2, "class", "section-title svelte-1kekzne");
    			add_location(h2, file$9, 24, 4, 764);
    			attr_dev(div0, "class", "copy svelte-1kekzne");
    			add_location(div0, file$9, 40, 4, 1309);
    			attr_dev(div1, "class", "references svelte-1kekzne");
    			add_location(div1, file$9, 47, 4, 1470);
    			attr_dev(div2, "class", "section section-3 svelte-1kekzne");
    			add_location(div2, file$9, 23, 0, 674);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, h2);
    			append_dev(div2, t1);
    			if_blocks[current_block_type_index].m(div2, null);
    			append_dev(div2, t2);
    			append_dev(div2, div0);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div0, null);
    			}

    			append_dev(div2, t3);
    			append_dev(div2, div1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(inView_action = inView.call(null, div2, { once: /*once*/ ctx[0] })),
    					listen_dev(div2, "enter", /*enter_handler*/ ctx[7], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div2, t2);
    			}

    			if (dirty & /*copy*/ 0) {
    				each_value_1 = data['section-two']['copy'];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$5(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1$5(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty & /*copy*/ 0) {
    				each_value = data['section-two']['references'];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$6(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$6(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (inView_action && is_function(inView_action.update) && dirty & /*once*/ 1) inView_action.update.call(null, { once: /*once*/ ctx[0] });
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if_blocks[current_block_type_index].d();
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Section3', slots, []);
    	let loaded = false;
    	let { once } = $$props;
    	let url_fig1 = 'assets/data/fig1_pnas_mean.csv';
    	let data_fig1;
    	let xKey = [0, 1];
    	let yKey = 'cluster';
    	let zKey = 'key';

    	onMount(async () => {
    		const res_fig1 = await csv(url_fig1, autoType);
    		$$invalidate(2, data_fig1 = res_fig1);
    	});

    	const writable_props = ['once'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Section3> was created with unknown prop '${key}'`);
    	});

    	const enter_handler = () => $$invalidate(1, loaded = true);

    	$$self.$$set = $$props => {
    		if ('once' in $$props) $$invalidate(0, once = $$props.once);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		csv,
    		autoType,
    		inView,
    		StackedBars,
    		copy: data,
    		formatPct,
    		loaded,
    		once,
    		url_fig1,
    		data_fig1,
    		xKey,
    		yKey,
    		zKey
    	});

    	$$self.$inject_state = $$props => {
    		if ('loaded' in $$props) $$invalidate(1, loaded = $$props.loaded);
    		if ('once' in $$props) $$invalidate(0, once = $$props.once);
    		if ('url_fig1' in $$props) $$invalidate(3, url_fig1 = $$props.url_fig1);
    		if ('data_fig1' in $$props) $$invalidate(2, data_fig1 = $$props.data_fig1);
    		if ('xKey' in $$props) $$invalidate(4, xKey = $$props.xKey);
    		if ('yKey' in $$props) $$invalidate(5, yKey = $$props.yKey);
    		if ('zKey' in $$props) $$invalidate(6, zKey = $$props.zKey);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [once, loaded, data_fig1, url_fig1, xKey, yKey, zKey, enter_handler];
    }

    class Section3 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, { once: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Section3",
    			options,
    			id: create_fragment$a.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*once*/ ctx[0] === undefined && !('once' in props)) {
    			console.warn("<Section3> was created without expected prop 'once'");
    		}
    	}

    	get once() {
    		throw new Error("<Section3>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set once(value) {
    		throw new Error("<Section3>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/main/Section4.svelte generated by Svelte v3.49.0 */
    const file$8 = "src/components/main/Section4.svelte";

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[13] = list[i];
    	child_ctx[15] = i;
    	return child_ctx;
    }

    function get_each_context_1$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[13] = list[i];
    	child_ctx[15] = i;
    	return child_ctx;
    }

    // (46:4) {:else}
    function create_else_block$3(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "chart-placeholder svelte-m0y2zp");
    			add_location(div, file$8, 45, 12, 1752);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(46:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (37:4) {#if loaded && data_fig4}
    function create_if_block$6(ctx) {
    	let sankeydiagram;
    	let current;

    	sankeydiagram = new SankeyDiagram({
    			props: {
    				nodes: /*nodes*/ ctx[3],
    				links: /*links*/ ctx[4],
    				url: /*url_fig4*/ ctx[5],
    				sourceLabel: 'Month',
    				targetLabel: 'Month + 1',
    				caption: 'Probability of flow from categories between months. Each month, users may not fall into any of these communities, if they are not among “news consumers” in that particular month.'
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(sankeydiagram.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(sankeydiagram, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const sankeydiagram_changes = {};
    			if (dirty & /*nodes*/ 8) sankeydiagram_changes.nodes = /*nodes*/ ctx[3];
    			if (dirty & /*links*/ 16) sankeydiagram_changes.links = /*links*/ ctx[4];
    			sankeydiagram.$set(sankeydiagram_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sankeydiagram.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sankeydiagram.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(sankeydiagram, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(37:4) {#if loaded && data_fig4}",
    		ctx
    	});

    	return block;
    }

    // (49:8) {#each copy['section-two']['copy'] as d, i}
    function create_each_block_1$4(ctx) {
    	let p;
    	let t0_value = /*d*/ ctx[13].value + "";
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text$1(t0_value);
    			t1 = space();
    			add_location(p, file$8, 49, 12, 1887);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$4.name,
    		type: "each",
    		source: "(49:8) {#each copy['section-two']['copy'] as d, i}",
    		ctx
    	});

    	return block;
    }

    // (56:8) {#each copy['section-two']['references'] as d, i}
    function create_each_block$5(ctx) {
    	let p;
    	let t0_value = /*d*/ ctx[13].value + "";
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text$1(t0_value);
    			t1 = space();
    			add_location(p, file$8, 56, 12, 2060);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$5.name,
    		type: "each",
    		source: "(56:8) {#each copy['section-two']['references'] as d, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let div2;
    	let h2;
    	let t1;
    	let current_block_type_index;
    	let if_block;
    	let t2;
    	let div0;
    	let t3;
    	let div1;
    	let inView_action;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block$6, create_else_block$3];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*loaded*/ ctx[1] && /*data_fig4*/ ctx[2]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	let each_value_1 = data['section-two']['copy'];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1$4(get_each_context_1$4(ctx, each_value_1, i));
    	}

    	let each_value = data['section-two']['references'];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			h2 = element("h2");
    			h2.textContent = "Subtitle 2";
    			t1 = space();
    			if_block.c();
    			t2 = space();
    			div0 = element("div");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t3 = space();
    			div1 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(h2, "class", "section-title svelte-m0y2zp");
    			add_location(h2, file$8, 35, 4, 1279);
    			attr_dev(div0, "class", "copy svelte-m0y2zp");
    			add_location(div0, file$8, 47, 4, 1804);
    			attr_dev(div1, "class", "references svelte-m0y2zp");
    			add_location(div1, file$8, 54, 4, 1965);
    			attr_dev(div2, "class", "section section-4 svelte-m0y2zp");
    			add_location(div2, file$8, 34, 0, 1189);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, h2);
    			append_dev(div2, t1);
    			if_blocks[current_block_type_index].m(div2, null);
    			append_dev(div2, t2);
    			append_dev(div2, div0);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div0, null);
    			}

    			append_dev(div2, t3);
    			append_dev(div2, div1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(inView_action = inView.call(null, div2, { once: /*once*/ ctx[0] })),
    					listen_dev(div2, "enter", /*enter_handler*/ ctx[6], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div2, t2);
    			}

    			if (dirty & /*copy*/ 0) {
    				each_value_1 = data['section-two']['copy'];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$4(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1$4(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty & /*copy*/ 0) {
    				each_value = data['section-two']['references'];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$5(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$5(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (inView_action && is_function(inView_action.update) && dirty & /*once*/ 1) inView_action.update.call(null, { once: /*once*/ ctx[0] });
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if_blocks[current_block_type_index].d();
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Section4', slots, []);
    	let loaded = false;
    	let { once } = $$props;
    	let url_fig1 = 'assets/data/fig1_ledwich.csv';
    	let data_fig1;
    	let xKey = [0, 1];
    	let yKey = 'cluster';
    	let zKey = 'key';
    	let url_fig4 = 'assets/data/fig4.csv';
    	let data_fig4;
    	let nodes;
    	let links;
    	let cols;

    	onMount(async () => {
    		const res_fig4 = await csv(url_fig4, autoType);
    		$$invalidate(2, data_fig4 = enforceOrder(res_fig4, ['fR', 'R', 'AW', 'C', 'L', 'fL'], 'from'));
    		cols = enforceOrder(res_fig4.columns, ['fR', 'R', 'AW', 'C', 'L', 'fL']);

    		$$invalidate(3, nodes = [
    			...data_fig4.map(d => ({ id: `source_${d.from}` })),
    			...cols.map(d => ({ id: `target_${d}` }))
    		]);

    		$$invalidate(4, links = flatten(data_fig4.map((d, i) => cols.map((e, l) => ({
    			sourceName: d.from,
    			targetName: e,
    			source: i,
    			target: l + 6,
    			value: d[e]
    		})))));
    	});

    	const writable_props = ['once'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Section4> was created with unknown prop '${key}'`);
    	});

    	const enter_handler = () => $$invalidate(1, loaded = true);

    	$$self.$$set = $$props => {
    		if ('once' in $$props) $$invalidate(0, once = $$props.once);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		csv,
    		autoType,
    		flatten,
    		inView,
    		SankeyDiagram,
    		copy: data,
    		enforceOrder,
    		loaded,
    		once,
    		url_fig1,
    		data_fig1,
    		xKey,
    		yKey,
    		zKey,
    		url_fig4,
    		data_fig4,
    		nodes,
    		links,
    		cols
    	});

    	$$self.$inject_state = $$props => {
    		if ('loaded' in $$props) $$invalidate(1, loaded = $$props.loaded);
    		if ('once' in $$props) $$invalidate(0, once = $$props.once);
    		if ('url_fig1' in $$props) url_fig1 = $$props.url_fig1;
    		if ('data_fig1' in $$props) data_fig1 = $$props.data_fig1;
    		if ('xKey' in $$props) xKey = $$props.xKey;
    		if ('yKey' in $$props) yKey = $$props.yKey;
    		if ('zKey' in $$props) zKey = $$props.zKey;
    		if ('url_fig4' in $$props) $$invalidate(5, url_fig4 = $$props.url_fig4);
    		if ('data_fig4' in $$props) $$invalidate(2, data_fig4 = $$props.data_fig4);
    		if ('nodes' in $$props) $$invalidate(3, nodes = $$props.nodes);
    		if ('links' in $$props) $$invalidate(4, links = $$props.links);
    		if ('cols' in $$props) cols = $$props.cols;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [once, loaded, data_fig4, nodes, links, url_fig4, enter_handler];
    }

    class Section4 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { once: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Section4",
    			options,
    			id: create_fragment$9.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*once*/ ctx[0] === undefined && !('once' in props)) {
    			console.warn("<Section4> was created without expected prop 'once'");
    		}
    	}

    	get once() {
    		throw new Error("<Section4>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set once(value) {
    		throw new Error("<Section4>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/graphs/atoms/Range.svelte generated by Svelte v3.49.0 */
    const file$7 = "src/components/graphs/atoms/Range.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[22] = list[i];
    	child_ctx[25] = i;
    	const constants_0 = extent(/*group*/ child_ctx[22][1], /*$x*/ child_ctx[1]).map(/*$xScale*/ child_ctx[2]);
    	child_ctx[23] = constants_0;
    	return child_ctx;
    }

    function get_each_context_1$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[26] = list[i];
    	child_ctx[28] = i;
    	return child_ctx;
    }

    // (33:12) {#each group[1] as d, l}
    function create_each_block_1$3(ctx) {
    	let circle;
    	let circle_cx_value;
    	let circle_cy_value;
    	let circle_r_value;
    	let circle_fill_value;
    	let mounted;
    	let dispose;

    	function mouseover_handler(...args) {
    		return /*mouseover_handler*/ ctx[17](/*d*/ ctx[26], ...args);
    	}

    	function focus_handler(...args) {
    		return /*focus_handler*/ ctx[18](/*d*/ ctx[26], ...args);
    	}

    	const block = {
    		c: function create() {
    			circle = svg_element("circle");
    			attr_dev(circle, "class", "range-circle svelte-s52soo");
    			attr_dev(circle, "cx", circle_cx_value = /*$xGet*/ ctx[5](/*d*/ ctx[26]));
    			attr_dev(circle, "cy", circle_cy_value = /*$yGet*/ ctx[4](/*d*/ ctx[26]));
    			attr_dev(circle, "r", circle_r_value = /*r*/ ctx[14](/*d*/ ctx[26].scenario));
    			attr_dev(circle, "fill", circle_fill_value = /*$zGet*/ ctx[6](/*d*/ ctx[26]));
    			add_location(circle, file$7, 33, 16, 1286);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, circle, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(circle, "mouseover", mouseover_handler, false, false, false),
    					listen_dev(circle, "focus", focus_handler, false, false, false),
    					listen_dev(circle, "mouseout", /*mouseout_handler*/ ctx[19], false, false, false),
    					listen_dev(circle, "blur", /*blur_handler*/ ctx[20], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*$xGet, $data*/ 33 && circle_cx_value !== (circle_cx_value = /*$xGet*/ ctx[5](/*d*/ ctx[26]))) {
    				attr_dev(circle, "cx", circle_cx_value);
    			}

    			if (dirty & /*$yGet, $data*/ 17 && circle_cy_value !== (circle_cy_value = /*$yGet*/ ctx[4](/*d*/ ctx[26]))) {
    				attr_dev(circle, "cy", circle_cy_value);
    			}

    			if (dirty & /*$data*/ 1 && circle_r_value !== (circle_r_value = /*r*/ ctx[14](/*d*/ ctx[26].scenario))) {
    				attr_dev(circle, "r", circle_r_value);
    			}

    			if (dirty & /*$zGet, $data*/ 65 && circle_fill_value !== (circle_fill_value = /*$zGet*/ ctx[6](/*d*/ ctx[26]))) {
    				attr_dev(circle, "fill", circle_fill_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(circle);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$3.name,
    		type: "each",
    		source: "(33:12) {#each group[1] as d, l}",
    		ctx
    	});

    	return block;
    }

    // (29:4) {#each $data as group, i}
    function create_each_block$4(ctx) {
    	let g;
    	let line;
    	let line_x__value;
    	let line_x__value_1;
    	let line_y__value;
    	let line_y__value_1;
    	let g_class_value;
    	let g_transform_value;
    	let each_value_1 = /*group*/ ctx[22][1];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$3(get_each_context_1$3(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			g = svg_element("g");
    			line = svg_element("line");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(line, "x1", line_x__value = /*extentLine*/ ctx[23][0]);
    			attr_dev(line, "x2", line_x__value_1 = /*extentLine*/ ctx[23][1]);
    			attr_dev(line, "y1", line_y__value = /*$yGet*/ ctx[4](/*group*/ ctx[22][1][0]));
    			attr_dev(line, "y2", line_y__value_1 = /*$yGet*/ ctx[4](/*group*/ ctx[22][1][0]));
    			attr_dev(line, "stroke", "gainsboro");
    			attr_dev(line, "stroke-width", /*r*/ ctx[14](2) * 2);
    			add_location(line, file$7, 31, 12, 1092);
    			attr_dev(g, "class", g_class_value = "" + (null_to_empty(`range-group range-group-${/*group*/ ctx[22][0]}`) + " svelte-s52soo"));
    			attr_dev(g, "transform", g_transform_value = `translate(0, ${/*$yScale*/ ctx[3].bandwidth() / 2})`);
    			add_location(g, file$7, 30, 8, 975);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, g, anchor);
    			append_dev(g, line);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(g, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$data, $x, $xScale*/ 7 && line_x__value !== (line_x__value = /*extentLine*/ ctx[23][0])) {
    				attr_dev(line, "x1", line_x__value);
    			}

    			if (dirty & /*$data, $x, $xScale*/ 7 && line_x__value_1 !== (line_x__value_1 = /*extentLine*/ ctx[23][1])) {
    				attr_dev(line, "x2", line_x__value_1);
    			}

    			if (dirty & /*$yGet, $data*/ 17 && line_y__value !== (line_y__value = /*$yGet*/ ctx[4](/*group*/ ctx[22][1][0]))) {
    				attr_dev(line, "y1", line_y__value);
    			}

    			if (dirty & /*$yGet, $data*/ 17 && line_y__value_1 !== (line_y__value_1 = /*$yGet*/ ctx[4](/*group*/ ctx[22][1][0]))) {
    				attr_dev(line, "y2", line_y__value_1);
    			}

    			if (dirty & /*$xGet, $data, $yGet, r, $zGet, handleMouseOver, handleMouseOut*/ 114801) {
    				each_value_1 = /*group*/ ctx[22][1];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$3(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(g, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}

    			if (dirty & /*$data*/ 1 && g_class_value !== (g_class_value = "" + (null_to_empty(`range-group range-group-${/*group*/ ctx[22][0]}`) + " svelte-s52soo"))) {
    				attr_dev(g, "class", g_class_value);
    			}

    			if (dirty & /*$yScale*/ 8 && g_transform_value !== (g_transform_value = `translate(0, ${/*$yScale*/ ctx[3].bandwidth() / 2})`)) {
    				attr_dev(g, "transform", g_transform_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(g);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(29:4) {#each $data as group, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let g;
    	let each_value = /*$data*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			g = svg_element("g");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(g, "class", "" + (null_to_empty(`vis-group`) + " svelte-s52soo"));
    			add_location(g, file$7, 27, 0, 849);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, g, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(g, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$data, $yScale, $xGet, $yGet, r, $zGet, handleMouseOver, handleMouseOut, extent, $x, $xScale*/ 114815) {
    				each_value = /*$data*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(g, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(g);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let $data;
    	let $x;
    	let $xScale;
    	let $yScale;
    	let $yGet;
    	let $xGet;
    	let $zGet;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Range', slots, []);
    	const { data, xGet, yGet, zGet, xScale, x, yScale } = getContext('LayerCake');
    	validate_store(data, 'data');
    	component_subscribe($$self, data, value => $$invalidate(0, $data = value));
    	validate_store(xGet, 'xGet');
    	component_subscribe($$self, xGet, value => $$invalidate(5, $xGet = value));
    	validate_store(yGet, 'yGet');
    	component_subscribe($$self, yGet, value => $$invalidate(4, $yGet = value));
    	validate_store(zGet, 'zGet');
    	component_subscribe($$self, zGet, value => $$invalidate(6, $zGet = value));
    	validate_store(xScale, 'xScale');
    	component_subscribe($$self, xScale, value => $$invalidate(2, $xScale = value));
    	validate_store(x, 'x');
    	component_subscribe($$self, x, value => $$invalidate(1, $x = value));
    	validate_store(yScale, 'yScale');
    	component_subscribe($$self, yScale, value => $$invalidate(3, $yScale = value));
    	const r = pow$1().exponent(1 / 2).domain([2, 4]).range([4, 7]);
    	const dispatch = createEventDispatcher();

    	function handleMouseOver(e, d) {
    		dispatch('mousemove', { e, props: d });

    		document.querySelectorAll('.range-circle').forEach(el => {
    			if (el !== e.target) el.classList.add('inactive'); else el.classList.add('active');
    		});
    	}

    	function handleMouseOut(e) {
    		dispatch('mouseout');
    		document.querySelectorAll('.range-circle').forEach(el => el.classList.remove('inactive'));
    		e.target.classList.remove('active');
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Range> was created with unknown prop '${key}'`);
    	});

    	const mouseover_handler = (d, e) => handleMouseOver(e, d);
    	const focus_handler = (d, e) => handleMouseOver(e, d);
    	const mouseout_handler = e => handleMouseOut(e);
    	const blur_handler = e => handleMouseOut(e);

    	$$self.$capture_state = () => ({
    		getContext,
    		createEventDispatcher,
    		scalePow: pow$1,
    		extent,
    		data,
    		xGet,
    		yGet,
    		zGet,
    		xScale,
    		x,
    		yScale,
    		r,
    		dispatch,
    		handleMouseOver,
    		handleMouseOut,
    		$data,
    		$x,
    		$xScale,
    		$yScale,
    		$yGet,
    		$xGet,
    		$zGet
    	});

    	return [
    		$data,
    		$x,
    		$xScale,
    		$yScale,
    		$yGet,
    		$xGet,
    		$zGet,
    		data,
    		xGet,
    		yGet,
    		zGet,
    		xScale,
    		x,
    		yScale,
    		r,
    		handleMouseOver,
    		handleMouseOut,
    		mouseover_handler,
    		focus_handler,
    		mouseout_handler,
    		blur_handler
    	];
    }

    class Range extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Range",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src/components/graphs/RangePlot.svelte generated by Svelte v3.49.0 */
    const file$6 = "src/components/graphs/RangePlot.svelte";

    function get_context$1(ctx) {
    	const constants_0 = { .../*detail*/ ctx[16].props };
    	ctx[17] = constants_0;
    }

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[18] = list[i];
    	const constants_0 = /*tooltipData*/ child_ctx[17][/*key*/ child_ctx[18]];
    	child_ctx[19] = constants_0;
    	return child_ctx;
    }

    // (43:12) <Svg>
    function create_default_slot_3(ctx) {
    	let axisx;
    	let t0;
    	let axisy;
    	let t1;
    	let range;
    	let current;

    	axisx = new AxisX({
    			props: {
    				gridlines: false,
    				ticks: 3,
    				snapTicks: false,
    				tickMarks: true
    			},
    			$$inline: true
    		});

    	axisy = new AxisY({
    			props: {
    				gridlines: false,
    				formatTick: /*func*/ ctx[13]
    			},
    			$$inline: true
    		});

    	range = new Range({ $$inline: true });
    	range.$on("mousemove", /*mousemove_handler*/ ctx[14]);
    	range.$on("mouseout", /*mouseout_handler*/ ctx[15]);

    	const block = {
    		c: function create() {
    			create_component(axisx.$$.fragment);
    			t0 = space();
    			create_component(axisy.$$.fragment);
    			t1 = space();
    			create_component(range.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(axisx, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(axisy, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(range, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(axisx.$$.fragment, local);
    			transition_in(axisy.$$.fragment, local);
    			transition_in(range.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(axisx.$$.fragment, local);
    			transition_out(axisy.$$.fragment, local);
    			transition_out(range.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(axisx, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(axisy, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(range, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(43:12) <Svg>",
    		ctx
    	});

    	return block;
    }

    // (60:16) {#if hideTooltip !== true}
    function create_if_block_1$2(ctx) {
    	let tooltip;
    	let current;

    	tooltip = new Tooltip({
    			props: {
    				evt: /*evt*/ ctx[9],
    				offset: -15,
    				$$slots: {
    					default: [
    						create_default_slot_2$1,
    						({ detail }) => ({ 16: detail }),
    						({ detail }) => detail ? 65536 : 0
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(tooltip.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(tooltip, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const tooltip_changes = {};
    			if (dirty & /*evt*/ 512) tooltip_changes.evt = /*evt*/ ctx[9];

    			if (dirty & /*$$scope, formatter, detail*/ 4260096) {
    				tooltip_changes.$$scope = { dirty, ctx };
    			}

    			tooltip.$set(tooltip_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tooltip.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tooltip.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tooltip, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(60:16) {#if hideTooltip !== true}",
    		ctx
    	});

    	return block;
    }

    // (76:24) {#each ['mean'] as key}
    function create_each_block$3(ctx) {
    	let div;
    	let t0;
    	let t1_value = /*formatter*/ ctx[8](/*value*/ ctx[19]) + "";
    	let t1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text$1("Difference in consumption: ");
    			t1 = text$1(t1_value);
    			attr_dev(div, "class", "row");
    			add_location(div, file$6, 77, 28, 2866);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*formatter, detail*/ 65792 && t1_value !== (t1_value = /*formatter*/ ctx[8](/*value*/ ctx[19]) + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(76:24) {#each ['mean'] as key}",
    		ctx
    	});

    	return block;
    }

    // (61:20) <Tooltip                         {evt}                         let:detail                         offset={-15}                     >
    function create_default_slot_2$1(ctx) {
    	get_context$1(ctx);
    	let div0;
    	let span;
    	let t0_value = labelMap.get(/*tooltipData*/ ctx[17].cluster) + "";
    	let t0;
    	let t1;
    	let div1;
    	let t2;
    	let t3_value = /*tooltipData*/ ctx[17].scenario + "";
    	let t3;
    	let t4;
    	let t5;
    	let each_1_anchor;
    	let each_value = ['mean'];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < 1; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			span = element("span");
    			t0 = text$1(t0_value);
    			t1 = space();
    			div1 = element("div");
    			t2 = text$1("Burst length: ");
    			t3 = text$1(t3_value);
    			t4 = text$1(" videos");
    			t5 = space();

    			for (let i = 0; i < 1; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    			attr_dev(span, "class", "cluster-label svelte-1sfmu5q");
    			set_style(span, "--color", colorMap.get(/*tooltipData*/ ctx[17].cluster));
    			add_location(span, file$6, 67, 28, 2325);
    			add_location(div0, file$6, 66, 24, 2291);
    			attr_dev(div1, "class", "row");
    			add_location(div1, file$6, 74, 24, 2661);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, span);
    			append_dev(span, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, t2);
    			append_dev(div1, t3);
    			append_dev(div1, t4);
    			insert_dev(target, t5, anchor);

    			for (let i = 0; i < 1; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			get_context$1(ctx);
    			if (dirty & /*detail*/ 65536 && t0_value !== (t0_value = labelMap.get(/*tooltipData*/ ctx[17].cluster) + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*detail*/ 65536) {
    				set_style(span, "--color", colorMap.get(/*tooltipData*/ ctx[17].cluster));
    			}

    			if (dirty & /*detail*/ 65536 && t3_value !== (t3_value = /*tooltipData*/ ctx[17].scenario + "")) set_data_dev(t3, t3_value);

    			if (dirty & /*formatter, detail*/ 65792) {
    				each_value = ['mean'];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < 1; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < 1; i += 1) {
    					each_blocks[i].d(1);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div1);
    			if (detaching) detach_dev(t5);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$1.name,
    		type: "slot",
    		source: "(61:20) <Tooltip                         {evt}                         let:detail                         offset={-15}                     >",
    		ctx
    	});

    	return block;
    }

    // (57:12) <Html                 pointerEvents={false}             >
    function create_default_slot_1$1(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*hideTooltip*/ ctx[10] !== true && create_if_block_1$2(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*hideTooltip*/ ctx[10] !== true) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*hideTooltip*/ 1024) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1$2(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(57:12) <Html                 pointerEvents={false}             >",
    		ctx
    	});

    	return block;
    }

    // (29:8) <LayerCake             padding={{ top: 0, right: 10, bottom: 20, left: 45 }}             flatData = { data }             data = { Array.from(groupedData) }             x={ xKey }             xNice={ true }             y={ yKey }             yScale={ scaleBand() }             yDomain={ seriesNames }             z={ zKey }             zScale={ scaleOrdinal() }             zDomain={ seriesNames }             zRange={ seriesColors }         >
    function create_default_slot$2(ctx) {
    	let svg;
    	let t;
    	let html;
    	let current;

    	svg = new Svg({
    			props: {
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	html = new Html({
    			props: {
    				pointerEvents: false,
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(svg.$$.fragment);
    			t = space();
    			create_component(html.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(svg, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(html, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const svg_changes = {};

    			if (dirty & /*$$scope, evt, hideTooltip*/ 4195840) {
    				svg_changes.$$scope = { dirty, ctx };
    			}

    			svg.$set(svg_changes);
    			const html_changes = {};

    			if (dirty & /*$$scope, evt, formatter, hideTooltip*/ 4196096) {
    				html_changes.$$scope = { dirty, ctx };
    			}

    			html.$set(html_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(svg.$$.fragment, local);
    			transition_in(html.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(svg.$$.fragment, local);
    			transition_out(html.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(svg, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(html, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(29:8) <LayerCake             padding={{ top: 0, right: 10, bottom: 20, left: 45 }}             flatData = { data }             data = { Array.from(groupedData) }             x={ xKey }             xNice={ true }             y={ yKey }             yScale={ scaleBand() }             yDomain={ seriesNames }             z={ zKey }             zScale={ scaleOrdinal() }             zDomain={ seriesNames }             zRange={ seriesColors }         >",
    		ctx
    	});

    	return block;
    }

    // (85:4) {#if includeCaption}
    function create_if_block$5(ctx) {
    	let caption_1;
    	let current;

    	caption_1 = new Caption({
    			props: {
    				caption: /*caption*/ ctx[0],
    				url: /*url*/ ctx[4],
    				type: 'single-cols'
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(caption_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(caption_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const caption_1_changes = {};
    			if (dirty & /*caption*/ 1) caption_1_changes.caption = /*caption*/ ctx[0];
    			if (dirty & /*url*/ 16) caption_1_changes.url = /*url*/ ctx[4];
    			caption_1.$set(caption_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(caption_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(caption_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(caption_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(85:4) {#if includeCaption}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let div1;
    	let div0;
    	let layercake;
    	let t;
    	let current;

    	layercake = new LayerCake({
    			props: {
    				padding: { top: 0, right: 10, bottom: 20, left: 45 },
    				flatData: /*data*/ ctx[2],
    				data: Array.from(/*groupedData*/ ctx[3]),
    				x: /*xKey*/ ctx[5],
    				xNice: true,
    				y: /*yKey*/ ctx[6],
    				yScale: band(),
    				yDomain: /*seriesNames*/ ctx[11],
    				z: /*zKey*/ ctx[7],
    				zScale: ordinal(),
    				zDomain: /*seriesNames*/ ctx[11],
    				zRange: /*seriesColors*/ ctx[12],
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let if_block = /*includeCaption*/ ctx[1] && create_if_block$5(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			create_component(layercake.$$.fragment);
    			t = space();
    			if (if_block) if_block.c();
    			attr_dev(div0, "class", "chart range-plot");
    			add_location(div0, file$6, 27, 4, 976);
    			attr_dev(div1, "class", "chart-wrapper svelte-1sfmu5q");
    			add_location(div1, file$6, 26, 0, 944);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			mount_component(layercake, div0, null);
    			append_dev(div1, t);
    			if (if_block) if_block.m(div1, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const layercake_changes = {};
    			if (dirty & /*data*/ 4) layercake_changes.flatData = /*data*/ ctx[2];
    			if (dirty & /*groupedData*/ 8) layercake_changes.data = Array.from(/*groupedData*/ ctx[3]);
    			if (dirty & /*xKey*/ 32) layercake_changes.x = /*xKey*/ ctx[5];
    			if (dirty & /*yKey*/ 64) layercake_changes.y = /*yKey*/ ctx[6];
    			if (dirty & /*zKey*/ 128) layercake_changes.z = /*zKey*/ ctx[7];

    			if (dirty & /*$$scope, evt, formatter, hideTooltip*/ 4196096) {
    				layercake_changes.$$scope = { dirty, ctx };
    			}

    			layercake.$set(layercake_changes);

    			if (/*includeCaption*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*includeCaption*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$5(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div1, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(layercake.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(layercake.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(layercake);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('RangePlot', slots, []);
    	let { caption = 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eius, tempore?' } = $$props;
    	let { includeCaption = true } = $$props;
    	let { data } = $$props;
    	let { groupedData } = $$props;
    	let { url } = $$props;
    	let { xKey } = $$props;
    	let { yKey } = $$props;
    	let { zKey } = $$props;
    	let { formatter = formatPct(0) } = $$props;
    	let seriesNames = Array.from(groupedData).map(d => d[0]);
    	let seriesColors = seriesNames.map(d => colorMap.get(d));
    	let evt;
    	let hideTooltip = true;

    	const writable_props = [
    		'caption',
    		'includeCaption',
    		'data',
    		'groupedData',
    		'url',
    		'xKey',
    		'yKey',
    		'zKey',
    		'formatter'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<RangePlot> was created with unknown prop '${key}'`);
    	});

    	const func = d => labelMap.get(d);
    	const mousemove_handler = event => $$invalidate(9, evt = $$invalidate(10, hideTooltip = event));
    	const mouseout_handler = () => $$invalidate(10, hideTooltip = true);

    	$$self.$$set = $$props => {
    		if ('caption' in $$props) $$invalidate(0, caption = $$props.caption);
    		if ('includeCaption' in $$props) $$invalidate(1, includeCaption = $$props.includeCaption);
    		if ('data' in $$props) $$invalidate(2, data = $$props.data);
    		if ('groupedData' in $$props) $$invalidate(3, groupedData = $$props.groupedData);
    		if ('url' in $$props) $$invalidate(4, url = $$props.url);
    		if ('xKey' in $$props) $$invalidate(5, xKey = $$props.xKey);
    		if ('yKey' in $$props) $$invalidate(6, yKey = $$props.yKey);
    		if ('zKey' in $$props) $$invalidate(7, zKey = $$props.zKey);
    		if ('formatter' in $$props) $$invalidate(8, formatter = $$props.formatter);
    	};

    	$$self.$capture_state = () => ({
    		LayerCake,
    		Svg,
    		Html,
    		scaleOrdinal: ordinal,
    		scaleBand: band,
    		AxisX,
    		AxisY,
    		Range,
    		Tooltip,
    		Caption,
    		colorMap,
    		labelMap,
    		formatPct,
    		caption,
    		includeCaption,
    		data,
    		groupedData,
    		url,
    		xKey,
    		yKey,
    		zKey,
    		formatter,
    		seriesNames,
    		seriesColors,
    		evt,
    		hideTooltip
    	});

    	$$self.$inject_state = $$props => {
    		if ('caption' in $$props) $$invalidate(0, caption = $$props.caption);
    		if ('includeCaption' in $$props) $$invalidate(1, includeCaption = $$props.includeCaption);
    		if ('data' in $$props) $$invalidate(2, data = $$props.data);
    		if ('groupedData' in $$props) $$invalidate(3, groupedData = $$props.groupedData);
    		if ('url' in $$props) $$invalidate(4, url = $$props.url);
    		if ('xKey' in $$props) $$invalidate(5, xKey = $$props.xKey);
    		if ('yKey' in $$props) $$invalidate(6, yKey = $$props.yKey);
    		if ('zKey' in $$props) $$invalidate(7, zKey = $$props.zKey);
    		if ('formatter' in $$props) $$invalidate(8, formatter = $$props.formatter);
    		if ('seriesNames' in $$props) $$invalidate(11, seriesNames = $$props.seriesNames);
    		if ('seriesColors' in $$props) $$invalidate(12, seriesColors = $$props.seriesColors);
    		if ('evt' in $$props) $$invalidate(9, evt = $$props.evt);
    		if ('hideTooltip' in $$props) $$invalidate(10, hideTooltip = $$props.hideTooltip);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		caption,
    		includeCaption,
    		data,
    		groupedData,
    		url,
    		xKey,
    		yKey,
    		zKey,
    		formatter,
    		evt,
    		hideTooltip,
    		seriesNames,
    		seriesColors,
    		func,
    		mousemove_handler,
    		mouseout_handler
    	];
    }

    class RangePlot extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {
    			caption: 0,
    			includeCaption: 1,
    			data: 2,
    			groupedData: 3,
    			url: 4,
    			xKey: 5,
    			yKey: 6,
    			zKey: 7,
    			formatter: 8
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "RangePlot",
    			options,
    			id: create_fragment$7.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*data*/ ctx[2] === undefined && !('data' in props)) {
    			console.warn("<RangePlot> was created without expected prop 'data'");
    		}

    		if (/*groupedData*/ ctx[3] === undefined && !('groupedData' in props)) {
    			console.warn("<RangePlot> was created without expected prop 'groupedData'");
    		}

    		if (/*url*/ ctx[4] === undefined && !('url' in props)) {
    			console.warn("<RangePlot> was created without expected prop 'url'");
    		}

    		if (/*xKey*/ ctx[5] === undefined && !('xKey' in props)) {
    			console.warn("<RangePlot> was created without expected prop 'xKey'");
    		}

    		if (/*yKey*/ ctx[6] === undefined && !('yKey' in props)) {
    			console.warn("<RangePlot> was created without expected prop 'yKey'");
    		}

    		if (/*zKey*/ ctx[7] === undefined && !('zKey' in props)) {
    			console.warn("<RangePlot> was created without expected prop 'zKey'");
    		}
    	}

    	get caption() {
    		throw new Error("<RangePlot>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set caption(value) {
    		throw new Error("<RangePlot>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get includeCaption() {
    		throw new Error("<RangePlot>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set includeCaption(value) {
    		throw new Error("<RangePlot>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get data() {
    		throw new Error("<RangePlot>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<RangePlot>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get groupedData() {
    		throw new Error("<RangePlot>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set groupedData(value) {
    		throw new Error("<RangePlot>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get url() {
    		throw new Error("<RangePlot>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set url(value) {
    		throw new Error("<RangePlot>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xKey() {
    		throw new Error("<RangePlot>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xKey(value) {
    		throw new Error("<RangePlot>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get yKey() {
    		throw new Error("<RangePlot>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set yKey(value) {
    		throw new Error("<RangePlot>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get zKey() {
    		throw new Error("<RangePlot>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set zKey(value) {
    		throw new Error("<RangePlot>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get formatter() {
    		throw new Error("<RangePlot>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set formatter(value) {
    		throw new Error("<RangePlot>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/main/Section5.svelte generated by Svelte v3.49.0 */
    const file$5 = "src/components/main/Section5.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[13] = list[i];
    	child_ctx[15] = i;
    	return child_ctx;
    }

    function get_each_context_1$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[13] = list[i];
    	child_ctx[15] = i;
    	return child_ctx;
    }

    // (58:8) {:else}
    function create_else_block_1$1(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "chart-placeholder svelte-cjebcy");
    			add_location(div, file$5, 57, 16, 2377);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1$1.name,
    		type: "else",
    		source: "(58:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (47:4) {#if loaded && data_fig5}
    function create_if_block_1$1(ctx) {
    	let rangeplot;
    	let current;

    	rangeplot = new RangePlot({
    			props: {
    				data: /*data_fig5*/ ctx[2],
    				groupedData: /*groupedData_fig5*/ ctx[3],
    				yKey: /*yKey*/ ctx[8],
    				xKey: /*xKey*/ ctx[7],
    				zKey: /*zKey*/ ctx[9],
    				formatter: func$1,
    				url: url_fig5,
    				caption: 'Difference in means of daily consumption change, in the event of bursty consumption from a specific political category. Individuals are assigned either to bursty consumption group in the event of watching 2 to 4 videos, or to a control group, if none of their sessions has more than one video from the same category in their lifetime. The exposure can be driven by user, recommendation, or external sources.'
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(rangeplot.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(rangeplot, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const rangeplot_changes = {};
    			if (dirty & /*data_fig5*/ 4) rangeplot_changes.data = /*data_fig5*/ ctx[2];
    			if (dirty & /*groupedData_fig5*/ 8) rangeplot_changes.groupedData = /*groupedData_fig5*/ ctx[3];
    			rangeplot.$set(rangeplot_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(rangeplot.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(rangeplot.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(rangeplot, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(47:4) {#if loaded && data_fig5}",
    		ctx
    	});

    	return block;
    }

    // (71:4) {:else}
    function create_else_block$2(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "chart-placeholder svelte-cjebcy");
    			add_location(div, file$5, 70, 12, 2860);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(71:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (60:4) {#if loaded && data_fig6}
    function create_if_block$4(ctx) {
    	let sankeydiagram;
    	let current;

    	sankeydiagram = new SankeyDiagram({
    			props: {
    				nodes: /*nodes*/ ctx[5],
    				links: /*links*/ ctx[6],
    				formatter: /*sankeyTooltipFormatter*/ ctx[10],
    				url: url_fig6,
    				spanCol: 6,
    				sourceLabel: 'YouTube',
    				targetLabel: 'News media',
    				caption: 'Risk ratio of consumption of polical content on YouTube from news content of politcal categories on the web.'
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(sankeydiagram.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(sankeydiagram, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const sankeydiagram_changes = {};
    			if (dirty & /*nodes*/ 32) sankeydiagram_changes.nodes = /*nodes*/ ctx[5];
    			if (dirty & /*links*/ 64) sankeydiagram_changes.links = /*links*/ ctx[6];
    			sankeydiagram.$set(sankeydiagram_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sankeydiagram.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sankeydiagram.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(sankeydiagram, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(60:4) {#if loaded && data_fig6}",
    		ctx
    	});

    	return block;
    }

    // (74:8) {#each copy['section-two']['copy'] as d, i}
    function create_each_block_1$2(ctx) {
    	let p;
    	let t0_value = /*d*/ ctx[13].value + "";
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text$1(t0_value);
    			t1 = space();
    			add_location(p, file$5, 74, 12, 2995);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$2.name,
    		type: "each",
    		source: "(74:8) {#each copy['section-two']['copy'] as d, i}",
    		ctx
    	});

    	return block;
    }

    // (81:8) {#each copy['section-two']['references'] as d, i}
    function create_each_block$2(ctx) {
    	let p;
    	let t0_value = /*d*/ ctx[13].value + "";
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text$1(t0_value);
    			t1 = space();
    			add_location(p, file$5, 81, 12, 3168);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(81:8) {#each copy['section-two']['references'] as d, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let div2;
    	let current_block_type_index;
    	let if_block0;
    	let t0;
    	let current_block_type_index_1;
    	let if_block1;
    	let t1;
    	let div0;
    	let t2;
    	let div1;
    	let inView_action;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block_1$1, create_else_block_1$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*loaded*/ ctx[1] && /*data_fig5*/ ctx[2]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	const if_block_creators_1 = [create_if_block$4, create_else_block$2];
    	const if_blocks_1 = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*loaded*/ ctx[1] && /*data_fig6*/ ctx[4]) return 0;
    		return 1;
    	}

    	current_block_type_index_1 = select_block_type_1(ctx);
    	if_block1 = if_blocks_1[current_block_type_index_1] = if_block_creators_1[current_block_type_index_1](ctx);
    	let each_value_1 = data['section-two']['copy'];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1$2(get_each_context_1$2(ctx, each_value_1, i));
    	}

    	let each_value = data['section-two']['references'];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			if_block0.c();
    			t0 = space();
    			if_block1.c();
    			t1 = space();
    			div0 = element("div");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t2 = space();
    			div1 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div0, "class", "copy svelte-cjebcy");
    			add_location(div0, file$5, 72, 4, 2912);
    			attr_dev(div1, "class", "references svelte-cjebcy");
    			add_location(div1, file$5, 79, 4, 3073);
    			attr_dev(div2, "class", "section section-5 svelte-cjebcy");
    			add_location(div2, file$5, 45, 0, 1566);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			if_blocks[current_block_type_index].m(div2, null);
    			append_dev(div2, t0);
    			if_blocks_1[current_block_type_index_1].m(div2, null);
    			append_dev(div2, t1);
    			append_dev(div2, div0);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div0, null);
    			}

    			append_dev(div2, t2);
    			append_dev(div2, div1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(inView_action = inView.call(null, div2, { once: /*once*/ ctx[0] })),
    					listen_dev(div2, "enter", /*enter_handler*/ ctx[11], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block0 = if_blocks[current_block_type_index];

    				if (!if_block0) {
    					if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block0.c();
    				} else {
    					if_block0.p(ctx, dirty);
    				}

    				transition_in(if_block0, 1);
    				if_block0.m(div2, t0);
    			}

    			let previous_block_index_1 = current_block_type_index_1;
    			current_block_type_index_1 = select_block_type_1(ctx);

    			if (current_block_type_index_1 === previous_block_index_1) {
    				if_blocks_1[current_block_type_index_1].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks_1[previous_block_index_1], 1, 1, () => {
    					if_blocks_1[previous_block_index_1] = null;
    				});

    				check_outros();
    				if_block1 = if_blocks_1[current_block_type_index_1];

    				if (!if_block1) {
    					if_block1 = if_blocks_1[current_block_type_index_1] = if_block_creators_1[current_block_type_index_1](ctx);
    					if_block1.c();
    				} else {
    					if_block1.p(ctx, dirty);
    				}

    				transition_in(if_block1, 1);
    				if_block1.m(div2, t1);
    			}

    			if (dirty & /*copy*/ 0) {
    				each_value_1 = data['section-two']['copy'];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$2(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1$2(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty & /*copy*/ 0) {
    				each_value = data['section-two']['references'];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (inView_action && is_function(inView_action.update) && dirty & /*once*/ 1) inView_action.update.call(null, { once: /*once*/ ctx[0] });
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if_blocks[current_block_type_index].d();
    			if_blocks_1[current_block_type_index_1].d();
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const url_fig5 = 'assets/data/fig5.csv';
    const url_fig6 = 'assets/data/fig6.csv';
    const func$1 = d => d.toFixed(2);

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Section5', slots, []);
    	let loaded = false;
    	let { once } = $$props;
    	let data_fig5;
    	let groupedData_fig5;
    	let xKey = 'mean';
    	let yKey = 'cluster';
    	let zKey = 'cluster';
    	let data_fig6;
    	let nodes;
    	let links;
    	let cols;

    	const sankeyTooltipFormatter = d => {
    		if (d === 1) return 'Just as likely as average user';
    		if (d > 1) return `More likely to consume than average user. Probability: ${d}`;
    		return `Less likely to consume than average user. Probability: ${d}`;
    	};

    	onMount(async () => {
    		const res_fig5 = await csv(url_fig5, autoType);
    		$$invalidate(2, data_fig5 = res_fig5);
    		$$invalidate(3, groupedData_fig5 = group(data_fig5, d => d[yKey]));
    		const res_fig6 = await csv(url_fig6, autoType);
    		$$invalidate(4, data_fig6 = res_fig6);
    		cols = enforceOrder(data_fig6.columns, ['fR', 'R', 'C', 'L', 'fL']);

    		$$invalidate(5, nodes = [
    			...data_fig6.map(d => ({ id: `source_${d.from}` })),
    			...cols.map(d => ({ id: `target_${d}` }))
    		]);

    		$$invalidate(6, links = flatten(data_fig6.map((d, i) => cols.map((e, l) => ({
    			sourceName: d.from,
    			targetName: e,
    			source: i,
    			target: l + 6,
    			value: d[e]
    		})))));
    	});

    	const writable_props = ['once'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Section5> was created with unknown prop '${key}'`);
    	});

    	const enter_handler = () => $$invalidate(1, loaded = true);

    	$$self.$$set = $$props => {
    		if ('once' in $$props) $$invalidate(0, once = $$props.once);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		csv,
    		group,
    		autoType,
    		flatten,
    		inView,
    		RangePlot,
    		SankeyDiagram,
    		copy: data,
    		enforceOrder,
    		loaded,
    		once,
    		url_fig5,
    		url_fig6,
    		data_fig5,
    		groupedData_fig5,
    		xKey,
    		yKey,
    		zKey,
    		data_fig6,
    		nodes,
    		links,
    		cols,
    		sankeyTooltipFormatter
    	});

    	$$self.$inject_state = $$props => {
    		if ('loaded' in $$props) $$invalidate(1, loaded = $$props.loaded);
    		if ('once' in $$props) $$invalidate(0, once = $$props.once);
    		if ('data_fig5' in $$props) $$invalidate(2, data_fig5 = $$props.data_fig5);
    		if ('groupedData_fig5' in $$props) $$invalidate(3, groupedData_fig5 = $$props.groupedData_fig5);
    		if ('xKey' in $$props) $$invalidate(7, xKey = $$props.xKey);
    		if ('yKey' in $$props) $$invalidate(8, yKey = $$props.yKey);
    		if ('zKey' in $$props) $$invalidate(9, zKey = $$props.zKey);
    		if ('data_fig6' in $$props) $$invalidate(4, data_fig6 = $$props.data_fig6);
    		if ('nodes' in $$props) $$invalidate(5, nodes = $$props.nodes);
    		if ('links' in $$props) $$invalidate(6, links = $$props.links);
    		if ('cols' in $$props) cols = $$props.cols;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		once,
    		loaded,
    		data_fig5,
    		groupedData_fig5,
    		data_fig6,
    		nodes,
    		links,
    		xKey,
    		yKey,
    		zKey,
    		sankeyTooltipFormatter,
    		enter_handler
    	];
    }

    class Section5 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { once: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Section5",
    			options,
    			id: create_fragment$6.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*once*/ ctx[0] === undefined && !('once' in props)) {
    			console.warn("<Section5> was created without expected prop 'once'");
    		}
    	}

    	get once() {
    		throw new Error("<Section5>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set once(value) {
    		throw new Error("<Section5>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/main/Section6.svelte generated by Svelte v3.49.0 */
    const file$4 = "src/components/main/Section6.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	child_ctx[10] = i;
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	child_ctx[10] = i;
    	return child_ctx;
    }

    // (55:4) {:else}
    function create_else_block_1(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "chart-placeholder svelte-cjebcy");
    			add_location(div, file$4, 54, 12, 2266);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(55:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (27:4) {#if loaded}
    function create_if_block_1(ctx) {
    	let chartwrapper;
    	let current;

    	chartwrapper = new ChartWrapper({
    			props: {
    				config: [
    					{
    						url: 'assets/data/fig7a.csv',
    						description: 'Fraction of videos by session length',
    						type: 'line',
    						xKey: 'index',
    						yKey: 'fraction',
    						zKey: 'cluster',
    						formatTickX: func,
    						formatTickY: func_1,
    						includeCaption: true,
    						caption: 'Mean fractions of videos as a function of normalized relative indices across session definitions for each political category, for sessions with length 20 or more videos.'
    					},
    					{
    						url: 'assets/data/fig7b.csv',
    						description: 'Frequency by session length',
    						type: 'line',
    						xKey: 'length',
    						yKey: 'mean',
    						zKey: 'cluster',
    						formatTickX: func_2,
    						formatTickY: func_3,
    						includeCaption: true,
    						caption: 'Average fraction of videos of a political category by numbers of videos in sessions. Sessions are between 10 and 60 minutes. Sessions with more than 30 videos (2% of sessions) were dropped.'
    					}
    				],
    				spanCol: 6
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(chartwrapper.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(chartwrapper, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(chartwrapper.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(chartwrapper.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(chartwrapper, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(27:4) {#if loaded}",
    		ctx
    	});

    	return block;
    }

    // (70:4) {:else}
    function create_else_block$1(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "chart-placeholder svelte-cjebcy");
    			add_location(div, file$4, 69, 12, 2753);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(70:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (57:4) {#if loaded && data_table2}
    function create_if_block$3(ctx) {
    	let stackedbars;
    	let current;

    	stackedbars = new StackedBars({
    			props: {
    				data: /*data_table2*/ ctx[2],
    				yKey: /*yKey*/ ctx[5],
    				xKey: /*xKey*/ ctx[4],
    				zKey: /*zKey*/ ctx[6],
    				formatter: formatPct(2),
    				keyColorMap: youTubeMap,
    				keyLabelMap: youTubeMap$1,
    				url: /*url_fig1*/ ctx[3],
    				spanCol: 6,
    				caption: 'Distribution of the entry points of videos within each political category'
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(stackedbars.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(stackedbars, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const stackedbars_changes = {};
    			if (dirty & /*data_table2*/ 4) stackedbars_changes.data = /*data_table2*/ ctx[2];
    			stackedbars.$set(stackedbars_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(stackedbars.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(stackedbars.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(stackedbars, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(57:4) {#if loaded && data_table2}",
    		ctx
    	});

    	return block;
    }

    // (73:8) {#each copy['section-two']['copy'] as d, i}
    function create_each_block_1$1(ctx) {
    	let p;
    	let t0_value = /*d*/ ctx[8].value + "";
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text$1(t0_value);
    			t1 = space();
    			add_location(p, file$4, 73, 12, 2888);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(73:8) {#each copy['section-two']['copy'] as d, i}",
    		ctx
    	});

    	return block;
    }

    // (80:8) {#each copy['section-two']['references'] as d, i}
    function create_each_block$1(ctx) {
    	let p;
    	let t0_value = /*d*/ ctx[8].value + "";
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text$1(t0_value);
    			t1 = space();
    			add_location(p, file$4, 80, 12, 3061);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(80:8) {#each copy['section-two']['references'] as d, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div2;
    	let current_block_type_index;
    	let if_block0;
    	let t0;
    	let current_block_type_index_1;
    	let if_block1;
    	let t1;
    	let div0;
    	let t2;
    	let div1;
    	let inView_action;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block_1, create_else_block_1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*loaded*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	const if_block_creators_1 = [create_if_block$3, create_else_block$1];
    	const if_blocks_1 = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*loaded*/ ctx[1] && /*data_table2*/ ctx[2]) return 0;
    		return 1;
    	}

    	current_block_type_index_1 = select_block_type_1(ctx);
    	if_block1 = if_blocks_1[current_block_type_index_1] = if_block_creators_1[current_block_type_index_1](ctx);
    	let each_value_1 = data['section-two']['copy'];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	let each_value = data['section-two']['references'];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			if_block0.c();
    			t0 = space();
    			if_block1.c();
    			t1 = space();
    			div0 = element("div");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t2 = space();
    			div1 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div0, "class", "copy svelte-cjebcy");
    			add_location(div0, file$4, 71, 4, 2805);
    			attr_dev(div1, "class", "references svelte-cjebcy");
    			add_location(div1, file$4, 78, 4, 2966);
    			attr_dev(div2, "class", "section section-5 svelte-cjebcy");
    			add_location(div2, file$4, 25, 0, 790);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			if_blocks[current_block_type_index].m(div2, null);
    			append_dev(div2, t0);
    			if_blocks_1[current_block_type_index_1].m(div2, null);
    			append_dev(div2, t1);
    			append_dev(div2, div0);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div0, null);
    			}

    			append_dev(div2, t2);
    			append_dev(div2, div1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(inView_action = inView.call(null, div2, { once: /*once*/ ctx[0] })),
    					listen_dev(div2, "enter", /*enter_handler*/ ctx[7], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index !== previous_block_index) {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block0 = if_blocks[current_block_type_index];

    				if (!if_block0) {
    					if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block0.c();
    				}

    				transition_in(if_block0, 1);
    				if_block0.m(div2, t0);
    			}

    			let previous_block_index_1 = current_block_type_index_1;
    			current_block_type_index_1 = select_block_type_1(ctx);

    			if (current_block_type_index_1 === previous_block_index_1) {
    				if_blocks_1[current_block_type_index_1].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks_1[previous_block_index_1], 1, 1, () => {
    					if_blocks_1[previous_block_index_1] = null;
    				});

    				check_outros();
    				if_block1 = if_blocks_1[current_block_type_index_1];

    				if (!if_block1) {
    					if_block1 = if_blocks_1[current_block_type_index_1] = if_block_creators_1[current_block_type_index_1](ctx);
    					if_block1.c();
    				} else {
    					if_block1.p(ctx, dirty);
    				}

    				transition_in(if_block1, 1);
    				if_block1.m(div2, t1);
    			}

    			if (dirty & /*copy*/ 0) {
    				each_value_1 = data['section-two']['copy'];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1$1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty & /*copy*/ 0) {
    				each_value = data['section-two']['references'];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (inView_action && is_function(inView_action.update) && dirty & /*once*/ 1) inView_action.update.call(null, { once: /*once*/ ctx[0] });
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if_blocks[current_block_type_index].d();
    			if_blocks_1[current_block_type_index_1].d();
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const func = d => d;
    const func_1 = d => d.toFixed(2);
    const func_2 = d => d;
    const func_3 = d => d.toFixed(2);

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Section6', slots, []);
    	let loaded = false;
    	let { once } = $$props;
    	let url_fig1 = 'assets/data/table2.csv';
    	let data_table2;
    	let xKey = [0, 1];
    	let yKey = 'cluster';
    	let zKey = 'key';

    	onMount(async () => {
    		const res = await csv(url_fig1, autoType);
    		$$invalidate(2, data_table2 = res);
    	});

    	const writable_props = ['once'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Section6> was created with unknown prop '${key}'`);
    	});

    	const enter_handler = () => $$invalidate(1, loaded = true);

    	$$self.$$set = $$props => {
    		if ('once' in $$props) $$invalidate(0, once = $$props.once);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		csv,
    		autoType,
    		inView,
    		StackedBars,
    		ChartWrapper,
    		labelMap: youTubeMap$1,
    		colorMap: youTubeMap,
    		formatPct,
    		copy: data,
    		loaded,
    		once,
    		url_fig1,
    		data_table2,
    		xKey,
    		yKey,
    		zKey
    	});

    	$$self.$inject_state = $$props => {
    		if ('loaded' in $$props) $$invalidate(1, loaded = $$props.loaded);
    		if ('once' in $$props) $$invalidate(0, once = $$props.once);
    		if ('url_fig1' in $$props) $$invalidate(3, url_fig1 = $$props.url_fig1);
    		if ('data_table2' in $$props) $$invalidate(2, data_table2 = $$props.data_table2);
    		if ('xKey' in $$props) $$invalidate(4, xKey = $$props.xKey);
    		if ('yKey' in $$props) $$invalidate(5, yKey = $$props.yKey);
    		if ('zKey' in $$props) $$invalidate(6, zKey = $$props.zKey);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [once, loaded, data_table2, url_fig1, xKey, yKey, zKey, enter_handler];
    }

    class Section6 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { once: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Section6",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*once*/ ctx[0] === undefined && !('once' in props)) {
    			console.warn("<Section6> was created without expected prop 'once'");
    		}
    	}

    	get once() {
    		throw new Error("<Section6>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set once(value) {
    		throw new Error("<Section6>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/graphs/atoms/Line.svelte generated by Svelte v3.49.0 */
    const file$3 = "src/components/graphs/atoms/Line.svelte";

    function create_fragment$4(ctx) {
    	let path_1;
    	let path_1_d_value;

    	const block = {
    		c: function create() {
    			path_1 = svg_element("path");
    			attr_dev(path_1, "class", "path-line svelte-1qmqbsf");
    			attr_dev(path_1, "d", path_1_d_value = /*path*/ ctx[1](/*$data*/ ctx[2]));
    			attr_dev(path_1, "stroke", /*stroke*/ ctx[0]);
    			add_location(path_1, file$3, 10, 0, 281);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, path_1, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*path, $data*/ 6 && path_1_d_value !== (path_1_d_value = /*path*/ ctx[1](/*$data*/ ctx[2]))) {
    				attr_dev(path_1, "d", path_1_d_value);
    			}

    			if (dirty & /*stroke*/ 1) {
    				attr_dev(path_1, "stroke", /*stroke*/ ctx[0]);
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(path_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let path;
    	let $yGet;
    	let $xGet;
    	let $data;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Line', slots, []);
    	const { data, xGet, yGet } = getContext('LayerCake');
    	validate_store(data, 'data');
    	component_subscribe($$self, data, value => $$invalidate(2, $data = value));
    	validate_store(xGet, 'xGet');
    	component_subscribe($$self, xGet, value => $$invalidate(7, $xGet = value));
    	validate_store(yGet, 'yGet');
    	component_subscribe($$self, yGet, value => $$invalidate(6, $yGet = value));
    	let { stroke = '#ab00d6' } = $$props;
    	const writable_props = ['stroke'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Line> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('stroke' in $$props) $$invalidate(0, stroke = $$props.stroke);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		line,
    		curveBasis,
    		data,
    		xGet,
    		yGet,
    		stroke,
    		path,
    		$yGet,
    		$xGet,
    		$data
    	});

    	$$self.$inject_state = $$props => {
    		if ('stroke' in $$props) $$invalidate(0, stroke = $$props.stroke);
    		if ('path' in $$props) $$invalidate(1, path = $$props.path);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$xGet, $yGet*/ 192) {
    			$$invalidate(1, path = line().x(d => $xGet(d)).y(d => $yGet(d)).curve(curveBasis));
    		}
    	};

    	return [stroke, path, $data, data, xGet, yGet, $yGet, $xGet];
    }

    class Line extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { stroke: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Line",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get stroke() {
    		throw new Error("<Line>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set stroke(value) {
    		throw new Error("<Line>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/graphs/tooltips/SingleLineTooltip.svelte generated by Svelte v3.49.0 */
    const file$2 = "src/components/graphs/tooltips/SingleLineTooltip.svelte";

    function get_context(ctx) {
    	const constants_0 = /*found*/ ctx[17];
    	ctx[19] = constants_0;
    }

    // (80:4) {#if visible === true}
    function create_if_block$2(ctx) {
    	let div0;
    	let t0;
    	let div3;
    	let div1;
    	let t1_value = /*formatTitle*/ ctx[0](/*tooltipData*/ ctx[19][/*$config*/ ctx[5].x]) + "";
    	let t1;
    	let t2;
    	let div2;
    	let t3_value = /*formatValue*/ ctx[1](/*tooltipData*/ ctx[19][/*$config*/ ctx[5].y]) + "";
    	let t3;

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t0 = space();
    			div3 = element("div");
    			div1 = element("div");
    			t1 = text$1(t1_value);
    			t2 = space();
    			div2 = element("div");
    			t3 = text$1(t3_value);
    			set_style(div0, "left", /*x*/ ctx[14] + "px");
    			attr_dev(div0, "class", "line svelte-zx4q6d");
    			add_location(div0, file$2, 80, 6, 2412);
    			attr_dev(div1, "class", "title svelte-zx4q6d");
    			add_location(div1, file$2, 91, 10, 2685);
    			attr_dev(div2, "class", "row");
    			add_location(div2, file$2, 92, 10, 2758);
    			attr_dev(div3, "class", "tooltip svelte-zx4q6d");
    			set_style(div3, "width", w + "px");
    			set_style(div3, "display", /*visible*/ ctx[16] ? 'block' : 'none');
    			set_style(div3, "left", Math.min(Math.max(/*w2*/ ctx[9], /*x*/ ctx[14]), /*$width*/ ctx[4] - /*w2*/ ctx[9]) + "px");
    			add_location(div3, file$2, 84, 6, 2486);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div1);
    			append_dev(div1, t1);
    			append_dev(div3, t2);
    			append_dev(div3, div2);
    			append_dev(div2, t3);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*x*/ 16384) {
    				set_style(div0, "left", /*x*/ ctx[14] + "px");
    			}

    			if (dirty & /*formatTitle, found, $config*/ 131105 && t1_value !== (t1_value = /*formatTitle*/ ctx[0](/*tooltipData*/ ctx[19][/*$config*/ ctx[5].x]) + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*formatValue, found, $config*/ 131106 && t3_value !== (t3_value = /*formatValue*/ ctx[1](/*tooltipData*/ ctx[19][/*$config*/ ctx[5].y]) + "")) set_data_dev(t3, t3_value);

    			if (dirty & /*visible*/ 65536) {
    				set_style(div3, "display", /*visible*/ ctx[16] ? 'block' : 'none');
    			}

    			if (dirty & /*x, $width*/ 16400) {
    				set_style(div3, "left", Math.min(Math.max(/*w2*/ ctx[9], /*x*/ ctx[14]), /*$width*/ ctx[4] - /*w2*/ ctx[9]) + "px");
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(80:4) {#if visible === true}",
    		ctx
    	});

    	return block;
    }

    // (70:2) <QuadTree     dataset={dataset || $data}     y='x'     let:x     let:y     let:visible     let:found     let:e   >
    function create_default_slot$1(ctx) {
    	get_context(ctx);
    	let if_block_anchor;
    	let if_block = /*visible*/ ctx[16] === true && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			get_context(ctx);

    			if (/*visible*/ ctx[16] === true) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(70:2) <QuadTree     dataset={dataset || $data}     y='x'     let:x     let:y     let:visible     let:found     let:e   >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let quadtree;
    	let current;

    	quadtree = new QuadtreeTooltip({
    			props: {
    				dataset: /*dataset*/ ctx[2] || /*$data*/ ctx[3],
    				y: "x",
    				$$slots: {
    					default: [
    						create_default_slot$1,
    						({ x, y, visible, found, e }) => ({
    							14: x,
    							15: y,
    							16: visible,
    							17: found,
    							18: e
    						}),
    						({ x, y, visible, found, e }) => (x ? 16384 : 0) | (y ? 32768 : 0) | (visible ? 65536 : 0) | (found ? 131072 : 0) | (e ? 262144 : 0)
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(quadtree.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(quadtree, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const quadtree_changes = {};
    			if (dirty & /*dataset, $data*/ 12) quadtree_changes.dataset = /*dataset*/ ctx[2] || /*$data*/ ctx[3];

    			if (dirty & /*$$scope, visible, x, $width, formatValue, found, $config, formatTitle*/ 1261619) {
    				quadtree_changes.$$scope = { dirty, ctx };
    			}

    			quadtree.$set(quadtree_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(quadtree.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(quadtree.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(quadtree, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const w = 150;

    function instance$3($$self, $$props, $$invalidate) {
    	let $data;
    	let $width;
    	let $config;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SingleLineTooltip', slots, []);
    	const { data, width, config } = getContext('LayerCake');
    	validate_store(data, 'data');
    	component_subscribe($$self, data, value => $$invalidate(3, $data = value));
    	validate_store(width, 'width');
    	component_subscribe($$self, width, value => $$invalidate(4, $width = value));
    	validate_store(config, 'config');
    	component_subscribe($$self, config, value => $$invalidate(5, $config = value));
    	const commas = format(',');
    	const titleCase = d => d.replace(/^\w/, w => w.toUpperCase());
    	let { formatTitle = d => d } = $$props;
    	let { formatValue = d => isNaN(+d) ? d : commas(d) } = $$props;
    	let { formatKey = d => titleCase(d) } = $$props;
    	let { offset = -20 } = $$props;
    	let { dataset = undefined } = $$props;
    	const w2 = w / 2;
    	const writable_props = ['formatTitle', 'formatValue', 'formatKey', 'offset', 'dataset'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SingleLineTooltip> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('formatTitle' in $$props) $$invalidate(0, formatTitle = $$props.formatTitle);
    		if ('formatValue' in $$props) $$invalidate(1, formatValue = $$props.formatValue);
    		if ('formatKey' in $$props) $$invalidate(10, formatKey = $$props.formatKey);
    		if ('offset' in $$props) $$invalidate(11, offset = $$props.offset);
    		if ('dataset' in $$props) $$invalidate(2, dataset = $$props.dataset);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		format,
    		QuadTree: QuadtreeTooltip,
    		data,
    		width,
    		config,
    		commas,
    		titleCase,
    		formatTitle,
    		formatValue,
    		formatKey,
    		offset,
    		dataset,
    		w,
    		w2,
    		$data,
    		$width,
    		$config
    	});

    	$$self.$inject_state = $$props => {
    		if ('formatTitle' in $$props) $$invalidate(0, formatTitle = $$props.formatTitle);
    		if ('formatValue' in $$props) $$invalidate(1, formatValue = $$props.formatValue);
    		if ('formatKey' in $$props) $$invalidate(10, formatKey = $$props.formatKey);
    		if ('offset' in $$props) $$invalidate(11, offset = $$props.offset);
    		if ('dataset' in $$props) $$invalidate(2, dataset = $$props.dataset);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		formatTitle,
    		formatValue,
    		dataset,
    		$data,
    		$width,
    		$config,
    		data,
    		width,
    		config,
    		w2,
    		formatKey,
    		offset
    	];
    }

    class SingleLineTooltip extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {
    			formatTitle: 0,
    			formatValue: 1,
    			formatKey: 10,
    			offset: 11,
    			dataset: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SingleLineTooltip",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get formatTitle() {
    		throw new Error("<SingleLineTooltip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set formatTitle(value) {
    		throw new Error("<SingleLineTooltip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get formatValue() {
    		throw new Error("<SingleLineTooltip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set formatValue(value) {
    		throw new Error("<SingleLineTooltip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get formatKey() {
    		throw new Error("<SingleLineTooltip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set formatKey(value) {
    		throw new Error("<SingleLineTooltip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get offset() {
    		throw new Error("<SingleLineTooltip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set offset(value) {
    		throw new Error("<SingleLineTooltip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dataset() {
    		throw new Error("<SingleLineTooltip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dataset(value) {
    		throw new Error("<SingleLineTooltip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/graphs/SingleLineChart.svelte generated by Svelte v3.49.0 */
    const file$1 = "src/components/graphs/SingleLineChart.svelte";

    // (37:3) <Svg>
    function create_default_slot_2(ctx) {
    	let axisx;
    	let t0;
    	let axisy;
    	let t1;
    	let line;
    	let current;

    	axisx = new AxisX({
    			props: {
    				gridlines: false,
    				ticks: 8,
    				formatTick: /*formatTickX*/ ctx[6],
    				snapTicks: false,
    				tickMarks: false
    			},
    			$$inline: true
    		});

    	axisy = new AxisY({
    			props: {
    				ticks: 4,
    				formatTick: /*formatTickY*/ ctx[7]
    			},
    			$$inline: true
    		});

    	line = new Line({
    			props: { stroke: /*stroke*/ ctx[10] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(axisx.$$.fragment);
    			t0 = space();
    			create_component(axisy.$$.fragment);
    			t1 = space();
    			create_component(line.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(axisx, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(axisy, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(line, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const axisx_changes = {};
    			if (dirty & /*formatTickX*/ 64) axisx_changes.formatTick = /*formatTickX*/ ctx[6];
    			axisx.$set(axisx_changes);
    			const axisy_changes = {};
    			if (dirty & /*formatTickY*/ 128) axisy_changes.formatTick = /*formatTickY*/ ctx[7];
    			axisy.$set(axisy_changes);
    			const line_changes = {};
    			if (dirty & /*stroke*/ 1024) line_changes.stroke = /*stroke*/ ctx[10];
    			line.$set(line_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(axisx.$$.fragment, local);
    			transition_in(axisy.$$.fragment, local);
    			transition_in(line.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(axisx.$$.fragment, local);
    			transition_out(axisy.$$.fragment, local);
    			transition_out(line.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(axisx, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(axisy, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(line, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(37:3) <Svg>",
    		ctx
    	});

    	return block;
    }

    // (52:3) <Html>
    function create_default_slot_1(ctx) {
    	let singlelinetooltip;
    	let current;

    	singlelinetooltip = new SingleLineTooltip({
    			props: {
    				dataset: /*data*/ ctx[1],
    				formatTitle: /*formatTickX*/ ctx[6],
    				formatKey: /*func*/ ctx[11],
    				formatValue: formatThousandsComma
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(singlelinetooltip.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(singlelinetooltip, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const singlelinetooltip_changes = {};
    			if (dirty & /*data*/ 2) singlelinetooltip_changes.dataset = /*data*/ ctx[1];
    			if (dirty & /*formatTickX*/ 64) singlelinetooltip_changes.formatTitle = /*formatTickX*/ ctx[6];
    			singlelinetooltip.$set(singlelinetooltip_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(singlelinetooltip.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(singlelinetooltip.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(singlelinetooltip, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(52:3) <Html>",
    		ctx
    	});

    	return block;
    }

    // (28:2) <LayerCake    padding={{ top: 20, right: 10, bottom: 20, left: 45 }}    { data }    x={ xKey }    xScale={ xKey === 'date' ? scaleTime() : scaleLinear() }    y={ yKey }    { yDomain }    yNice={ true }   >
    function create_default_slot(ctx) {
    	let svg;
    	let t;
    	let html;
    	let current;

    	svg = new Svg({
    			props: {
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	html = new Html({
    			props: {
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(svg.$$.fragment);
    			t = space();
    			create_component(html.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(svg, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(html, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const svg_changes = {};

    			if (dirty & /*$$scope, stroke, formatTickY, formatTickX*/ 5312) {
    				svg_changes.$$scope = { dirty, ctx };
    			}

    			svg.$set(svg_changes);
    			const html_changes = {};

    			if (dirty & /*$$scope, data, formatTickX*/ 4162) {
    				html_changes.$$scope = { dirty, ctx };
    			}

    			html.$set(html_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(svg.$$.fragment, local);
    			transition_in(html.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(svg.$$.fragment, local);
    			transition_out(html.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(svg, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(html, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(28:2) <LayerCake    padding={{ top: 20, right: 10, bottom: 20, left: 45 }}    { data }    x={ xKey }    xScale={ xKey === 'date' ? scaleTime() : scaleLinear() }    y={ yKey }    { yDomain }    yNice={ true }   >",
    		ctx
    	});

    	return block;
    }

    // (62:1) {#if includeCaption}
    function create_if_block$1(ctx) {
    	let caption_1;
    	let current;

    	caption_1 = new Caption({
    			props: {
    				caption: /*caption*/ ctx[0],
    				url: /*url*/ ctx[2],
    				type: /*spanCol*/ ctx[9] === 12 ? 'split-cols' : 'single-cols'
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(caption_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(caption_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const caption_1_changes = {};
    			if (dirty & /*caption*/ 1) caption_1_changes.caption = /*caption*/ ctx[0];
    			if (dirty & /*url*/ 4) caption_1_changes.url = /*url*/ ctx[2];
    			if (dirty & /*spanCol*/ 512) caption_1_changes.type = /*spanCol*/ ctx[9] === 12 ? 'split-cols' : 'single-cols';
    			caption_1.$set(caption_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(caption_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(caption_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(caption_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(62:1) {#if includeCaption}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div1;
    	let div0;
    	let layercake;
    	let t;
    	let div1_class_value;
    	let div1_style_value;
    	let current;

    	layercake = new LayerCake({
    			props: {
    				padding: { top: 20, right: 10, bottom: 20, left: 45 },
    				data: /*data*/ ctx[1],
    				x: /*xKey*/ ctx[3],
    				xScale: /*xKey*/ ctx[3] === 'date' ? time() : linear(),
    				y: /*yKey*/ ctx[4],
    				yDomain: /*yDomain*/ ctx[5],
    				yNice: true,
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let if_block = /*includeCaption*/ ctx[8] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			create_component(layercake.$$.fragment);
    			t = space();
    			if (if_block) if_block.c();
    			attr_dev(div0, "class", "chart line-chart");
    			add_location(div0, file$1, 26, 1, 858);
    			attr_dev(div1, "class", div1_class_value = "" + (null_to_empty(`chart-wrapper ${/*spanCol*/ ctx[9] === 12 ? 'split-cols' : 'single-cols'}`) + " svelte-1c7of4m"));
    			attr_dev(div1, "style", div1_style_value = `--spanCol: ${/*spanCol*/ ctx[9]}`);
    			add_location(div1, file$1, 22, 0, 741);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			mount_component(layercake, div0, null);
    			append_dev(div1, t);
    			if (if_block) if_block.m(div1, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const layercake_changes = {};
    			if (dirty & /*data*/ 2) layercake_changes.data = /*data*/ ctx[1];
    			if (dirty & /*xKey*/ 8) layercake_changes.x = /*xKey*/ ctx[3];
    			if (dirty & /*xKey*/ 8) layercake_changes.xScale = /*xKey*/ ctx[3] === 'date' ? time() : linear();
    			if (dirty & /*yKey*/ 16) layercake_changes.y = /*yKey*/ ctx[4];
    			if (dirty & /*yDomain*/ 32) layercake_changes.yDomain = /*yDomain*/ ctx[5];

    			if (dirty & /*$$scope, data, formatTickX, stroke, formatTickY*/ 5314) {
    				layercake_changes.$$scope = { dirty, ctx };
    			}

    			layercake.$set(layercake_changes);

    			if (/*includeCaption*/ ctx[8]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*includeCaption*/ 256) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div1, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*spanCol*/ 512 && div1_class_value !== (div1_class_value = "" + (null_to_empty(`chart-wrapper ${/*spanCol*/ ctx[9] === 12 ? 'split-cols' : 'single-cols'}`) + " svelte-1c7of4m"))) {
    				attr_dev(div1, "class", div1_class_value);
    			}

    			if (!current || dirty & /*spanCol*/ 512 && div1_style_value !== (div1_style_value = `--spanCol: ${/*spanCol*/ ctx[9]}`)) {
    				attr_dev(div1, "style", div1_style_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(layercake.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(layercake.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(layercake);
    			if (if_block) if_block.d();
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

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SingleLineChart', slots, []);
    	let { caption } = $$props;
    	let { data } = $$props;
    	let { url } = $$props;
    	let { xKey } = $$props;
    	let { yKey } = $$props;
    	let { yDomain = [0, null] } = $$props;
    	let { formatTickX } = $$props;
    	let { formatTickY = d => d.toFixed(0) } = $$props;
    	let { includeCaption = true } = $$props;
    	let { spanCol } = $$props;
    	let { stroke } = $$props;

    	const writable_props = [
    		'caption',
    		'data',
    		'url',
    		'xKey',
    		'yKey',
    		'yDomain',
    		'formatTickX',
    		'formatTickY',
    		'includeCaption',
    		'spanCol',
    		'stroke'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SingleLineChart> was created with unknown prop '${key}'`);
    	});

    	const func = d => labelMap.get(d);

    	$$self.$$set = $$props => {
    		if ('caption' in $$props) $$invalidate(0, caption = $$props.caption);
    		if ('data' in $$props) $$invalidate(1, data = $$props.data);
    		if ('url' in $$props) $$invalidate(2, url = $$props.url);
    		if ('xKey' in $$props) $$invalidate(3, xKey = $$props.xKey);
    		if ('yKey' in $$props) $$invalidate(4, yKey = $$props.yKey);
    		if ('yDomain' in $$props) $$invalidate(5, yDomain = $$props.yDomain);
    		if ('formatTickX' in $$props) $$invalidate(6, formatTickX = $$props.formatTickX);
    		if ('formatTickY' in $$props) $$invalidate(7, formatTickY = $$props.formatTickY);
    		if ('includeCaption' in $$props) $$invalidate(8, includeCaption = $$props.includeCaption);
    		if ('spanCol' in $$props) $$invalidate(9, spanCol = $$props.spanCol);
    		if ('stroke' in $$props) $$invalidate(10, stroke = $$props.stroke);
    	};

    	$$self.$capture_state = () => ({
    		Html,
    		LayerCake,
    		Svg,
    		scaleTime: time,
    		scaleLinear: linear,
    		Line,
    		AxisX,
    		AxisY,
    		SingleLineTooltip,
    		Caption,
    		labelMap,
    		formatThousandsComma,
    		caption,
    		data,
    		url,
    		xKey,
    		yKey,
    		yDomain,
    		formatTickX,
    		formatTickY,
    		includeCaption,
    		spanCol,
    		stroke
    	});

    	$$self.$inject_state = $$props => {
    		if ('caption' in $$props) $$invalidate(0, caption = $$props.caption);
    		if ('data' in $$props) $$invalidate(1, data = $$props.data);
    		if ('url' in $$props) $$invalidate(2, url = $$props.url);
    		if ('xKey' in $$props) $$invalidate(3, xKey = $$props.xKey);
    		if ('yKey' in $$props) $$invalidate(4, yKey = $$props.yKey);
    		if ('yDomain' in $$props) $$invalidate(5, yDomain = $$props.yDomain);
    		if ('formatTickX' in $$props) $$invalidate(6, formatTickX = $$props.formatTickX);
    		if ('formatTickY' in $$props) $$invalidate(7, formatTickY = $$props.formatTickY);
    		if ('includeCaption' in $$props) $$invalidate(8, includeCaption = $$props.includeCaption);
    		if ('spanCol' in $$props) $$invalidate(9, spanCol = $$props.spanCol);
    		if ('stroke' in $$props) $$invalidate(10, stroke = $$props.stroke);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		caption,
    		data,
    		url,
    		xKey,
    		yKey,
    		yDomain,
    		formatTickX,
    		formatTickY,
    		includeCaption,
    		spanCol,
    		stroke,
    		func
    	];
    }

    class SingleLineChart extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {
    			caption: 0,
    			data: 1,
    			url: 2,
    			xKey: 3,
    			yKey: 4,
    			yDomain: 5,
    			formatTickX: 6,
    			formatTickY: 7,
    			includeCaption: 8,
    			spanCol: 9,
    			stroke: 10
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SingleLineChart",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*caption*/ ctx[0] === undefined && !('caption' in props)) {
    			console.warn("<SingleLineChart> was created without expected prop 'caption'");
    		}

    		if (/*data*/ ctx[1] === undefined && !('data' in props)) {
    			console.warn("<SingleLineChart> was created without expected prop 'data'");
    		}

    		if (/*url*/ ctx[2] === undefined && !('url' in props)) {
    			console.warn("<SingleLineChart> was created without expected prop 'url'");
    		}

    		if (/*xKey*/ ctx[3] === undefined && !('xKey' in props)) {
    			console.warn("<SingleLineChart> was created without expected prop 'xKey'");
    		}

    		if (/*yKey*/ ctx[4] === undefined && !('yKey' in props)) {
    			console.warn("<SingleLineChart> was created without expected prop 'yKey'");
    		}

    		if (/*formatTickX*/ ctx[6] === undefined && !('formatTickX' in props)) {
    			console.warn("<SingleLineChart> was created without expected prop 'formatTickX'");
    		}

    		if (/*spanCol*/ ctx[9] === undefined && !('spanCol' in props)) {
    			console.warn("<SingleLineChart> was created without expected prop 'spanCol'");
    		}

    		if (/*stroke*/ ctx[10] === undefined && !('stroke' in props)) {
    			console.warn("<SingleLineChart> was created without expected prop 'stroke'");
    		}
    	}

    	get caption() {
    		throw new Error("<SingleLineChart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set caption(value) {
    		throw new Error("<SingleLineChart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get data() {
    		throw new Error("<SingleLineChart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<SingleLineChart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get url() {
    		throw new Error("<SingleLineChart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set url(value) {
    		throw new Error("<SingleLineChart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xKey() {
    		throw new Error("<SingleLineChart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xKey(value) {
    		throw new Error("<SingleLineChart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get yKey() {
    		throw new Error("<SingleLineChart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set yKey(value) {
    		throw new Error("<SingleLineChart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get yDomain() {
    		throw new Error("<SingleLineChart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set yDomain(value) {
    		throw new Error("<SingleLineChart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get formatTickX() {
    		throw new Error("<SingleLineChart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set formatTickX(value) {
    		throw new Error("<SingleLineChart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get formatTickY() {
    		throw new Error("<SingleLineChart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set formatTickY(value) {
    		throw new Error("<SingleLineChart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get includeCaption() {
    		throw new Error("<SingleLineChart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set includeCaption(value) {
    		throw new Error("<SingleLineChart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get spanCol() {
    		throw new Error("<SingleLineChart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set spanCol(value) {
    		throw new Error("<SingleLineChart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get stroke() {
    		throw new Error("<SingleLineChart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set stroke(value) {
    		throw new Error("<SingleLineChart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/main/Supplementary.svelte generated by Svelte v3.49.0 */
    const file = "src/components/main/Supplementary.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	child_ctx[9] = i;
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	child_ctx[9] = i;
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	child_ctx[9] = i;
    	return child_ctx;
    }

    function get_each_context_3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	child_ctx[9] = i;
    	return child_ctx;
    }

    // (36:8) {:else}
    function create_else_block(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "chart-placeholder svelte-1vxijr7");
    			add_location(div, file, 35, 16, 1248);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(36:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (24:8) {#if loaded}
    function create_if_block(ctx) {
    	let singlelinechart;
    	let current;

    	singlelinechart = new SingleLineChart({
    			props: {
    				data: /*data_videos*/ ctx[2],
    				url: /*videos_url*/ ctx[3],
    				xKey: /*xKey*/ ctx[4],
    				yKey: /*yKey*/ ctx[5],
    				formatTickX: timeFormat('%b %Y'),
    				formatTickY: formatThousands,
    				caption: 'Montly videos crawled.',
    				spanCol: 12,
    				stroke: '#E08A00'
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(singlelinechart.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(singlelinechart, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const singlelinechart_changes = {};
    			if (dirty & /*data_videos*/ 4) singlelinechart_changes.data = /*data_videos*/ ctx[2];
    			singlelinechart.$set(singlelinechart_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(singlelinechart.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(singlelinechart.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(singlelinechart, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(24:8) {#if loaded}",
    		ctx
    	});

    	return block;
    }

    // (39:12) {#each copy['section-two']['copy'] as d, i}
    function create_each_block_3(ctx) {
    	let p;
    	let t_value = /*d*/ ctx[7].value + "";
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text$1(t_value);
    			attr_dev(p, "class", "svelte-1vxijr7");
    			add_location(p, file, 39, 16, 1399);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_3.name,
    		type: "each",
    		source: "(39:12) {#each copy['section-two']['copy'] as d, i}",
    		ctx
    	});

    	return block;
    }

    // (44:12) {#each copy['section-two']['copy'] as d, i}
    function create_each_block_2(ctx) {
    	let p;
    	let t_value = /*d*/ ctx[7].value + "";
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text$1(t_value);
    			attr_dev(p, "class", "svelte-1vxijr7");
    			add_location(p, file, 44, 16, 1546);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(44:12) {#each copy['section-two']['copy'] as d, i}",
    		ctx
    	});

    	return block;
    }

    // (49:12) {#each copy['section-two']['copy'] as d, i}
    function create_each_block_1(ctx) {
    	let p;
    	let t0_value = /*d*/ ctx[7].value + "";
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text$1(t0_value);
    			t1 = space();
    			attr_dev(p, "class", "svelte-1vxijr7");
    			add_location(p, file, 49, 16, 1693);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(49:12) {#each copy['section-two']['copy'] as d, i}",
    		ctx
    	});

    	return block;
    }

    // (56:12) {#each copy['section-two']['references'] as d, i}
    function create_each_block(ctx) {
    	let p;
    	let t0_value = /*d*/ ctx[7].value + "";
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text$1(t0_value);
    			t1 = space();
    			add_location(p, file, 56, 16, 1894);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(56:12) {#each copy['section-two']['references'] as d, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let main;
    	let div2;
    	let h2;
    	let t1;
    	let current_block_type_index;
    	let if_block;
    	let t2;
    	let div0;
    	let t3;
    	let t4;
    	let t5;
    	let div1;
    	let inView_action;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*loaded*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	let each_value_3 = data['section-two']['copy'];
    	validate_each_argument(each_value_3);
    	let each_blocks_3 = [];

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		each_blocks_3[i] = create_each_block_3(get_each_context_3(ctx, each_value_3, i));
    	}

    	let each_value_2 = data['section-two']['copy'];
    	validate_each_argument(each_value_2);
    	let each_blocks_2 = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks_2[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	let each_value_1 = data['section-two']['copy'];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	let each_value = data['section-two']['references'];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			main = element("main");
    			div2 = element("div");
    			h2 = element("h2");
    			h2.textContent = "Supplementary information appendix";
    			t1 = space();
    			if_block.c();
    			t2 = space();
    			div0 = element("div");

    			for (let i = 0; i < each_blocks_3.length; i += 1) {
    				each_blocks_3[i].c();
    			}

    			t3 = space();

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].c();
    			}

    			t4 = space();

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t5 = space();
    			div1 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(h2, "class", "section-title svelte-1vxijr7");
    			add_location(h2, file, 22, 8, 758);
    			attr_dev(div0, "class", "copy svelte-1vxijr7");
    			add_location(div0, file, 37, 8, 1308);
    			attr_dev(div1, "class", "references svelte-1vxijr7");
    			add_location(div1, file, 54, 8, 1791);
    			attr_dev(div2, "class", "section section-supplementary svelte-1vxijr7");
    			add_location(div2, file, 21, 4, 652);
    			attr_dev(main, "class", "supplementary svelte-1vxijr7");
    			add_location(main, file, 20, 0, 619);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div2);
    			append_dev(div2, h2);
    			append_dev(div2, t1);
    			if_blocks[current_block_type_index].m(div2, null);
    			append_dev(div2, t2);
    			append_dev(div2, div0);

    			for (let i = 0; i < each_blocks_3.length; i += 1) {
    				each_blocks_3[i].m(div0, null);
    			}

    			append_dev(div0, t3);

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].m(div0, null);
    			}

    			append_dev(div0, t4);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div0, null);
    			}

    			append_dev(div2, t5);
    			append_dev(div2, div1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(inView_action = inView.call(null, div2, { once: /*once*/ ctx[0] })),
    					listen_dev(div2, "enter", /*enter_handler*/ ctx[6], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div2, t2);
    			}

    			if (dirty & /*copy*/ 0) {
    				each_value_3 = data['section-two']['copy'];
    				validate_each_argument(each_value_3);
    				let i;

    				for (i = 0; i < each_value_3.length; i += 1) {
    					const child_ctx = get_each_context_3(ctx, each_value_3, i);

    					if (each_blocks_3[i]) {
    						each_blocks_3[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_3[i] = create_each_block_3(child_ctx);
    						each_blocks_3[i].c();
    						each_blocks_3[i].m(div0, t3);
    					}
    				}

    				for (; i < each_blocks_3.length; i += 1) {
    					each_blocks_3[i].d(1);
    				}

    				each_blocks_3.length = each_value_3.length;
    			}

    			if (dirty & /*copy*/ 0) {
    				each_value_2 = data['section-two']['copy'];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks_2[i]) {
    						each_blocks_2[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_2[i] = create_each_block_2(child_ctx);
    						each_blocks_2[i].c();
    						each_blocks_2[i].m(div0, t4);
    					}
    				}

    				for (; i < each_blocks_2.length; i += 1) {
    					each_blocks_2[i].d(1);
    				}

    				each_blocks_2.length = each_value_2.length;
    			}

    			if (dirty & /*copy*/ 0) {
    				each_value_1 = data['section-two']['copy'];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty & /*copy*/ 0) {
    				each_value = data['section-two']['references'];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (inView_action && is_function(inView_action.update) && dirty & /*once*/ 1) inView_action.update.call(null, { once: /*once*/ ctx[0] });
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if_blocks[current_block_type_index].d();
    			destroy_each(each_blocks_3, detaching);
    			destroy_each(each_blocks_2, detaching);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
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

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Supplementary', slots, []);
    	let loaded = false;
    	let { once } = $$props;
    	let videos_url = 'assets/data/video_count.csv';
    	let data_videos;
    	let xKey = 'date';
    	let yKey = 'count';

    	onMount(async () => {
    		const res = await csv(videos_url, autoType);
    		$$invalidate(2, data_videos = res);
    	});

    	const writable_props = ['once'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Supplementary> was created with unknown prop '${key}'`);
    	});

    	const enter_handler = () => $$invalidate(1, loaded = true);

    	$$self.$$set = $$props => {
    		if ('once' in $$props) $$invalidate(0, once = $$props.once);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		csv,
    		autoType,
    		timeFormat,
    		inView,
    		SingleLineChart,
    		formatThousands,
    		copy: data,
    		loaded,
    		once,
    		videos_url,
    		data_videos,
    		xKey,
    		yKey
    	});

    	$$self.$inject_state = $$props => {
    		if ('loaded' in $$props) $$invalidate(1, loaded = $$props.loaded);
    		if ('once' in $$props) $$invalidate(0, once = $$props.once);
    		if ('videos_url' in $$props) $$invalidate(3, videos_url = $$props.videos_url);
    		if ('data_videos' in $$props) $$invalidate(2, data_videos = $$props.data_videos);
    		if ('xKey' in $$props) $$invalidate(4, xKey = $$props.xKey);
    		if ('yKey' in $$props) $$invalidate(5, yKey = $$props.yKey);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [once, loaded, data_videos, videos_url, xKey, yKey, enter_handler];
    }

    class Supplementary extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { once: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Supplementary",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*once*/ ctx[0] === undefined && !('once' in props)) {
    			console.warn("<Supplementary> was created without expected prop 'once'");
    		}
    	}

    	get once() {
    		throw new Error("<Supplementary>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set once(value) {
    		throw new Error("<Supplementary>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.49.0 */

    function create_fragment(ctx) {
    	let header;
    	let t0;
    	let main;
    	let t1;
    	let section1;
    	let t2;
    	let section2;
    	let t3;
    	let section3;
    	let t4;
    	let section4;
    	let t5;
    	let section5;
    	let t6;
    	let section6;
    	let t7;
    	let supplementary;
    	let t8;
    	let footer;
    	let current;
    	header = new Header({ $$inline: true });

    	main = new Main({
    			props: {
    				title: /*title*/ ctx[0],
    				authors: /*authors*/ ctx[1]
    			},
    			$$inline: true
    		});

    	section1 = new Section1({ props: { once: true }, $$inline: true });
    	section2 = new Section2({ props: { once: true }, $$inline: true });
    	section3 = new Section3({ props: { once: true }, $$inline: true });
    	section4 = new Section4({ props: { once: true }, $$inline: true });
    	section5 = new Section5({ props: { once: true }, $$inline: true });
    	section6 = new Section6({ props: { once: true }, $$inline: true });
    	supplementary = new Supplementary({ props: { once: true }, $$inline: true });
    	footer = new Footer({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(header.$$.fragment);
    			t0 = space();
    			create_component(main.$$.fragment);
    			t1 = space();
    			create_component(section1.$$.fragment);
    			t2 = space();
    			create_component(section2.$$.fragment);
    			t3 = space();
    			create_component(section3.$$.fragment);
    			t4 = space();
    			create_component(section4.$$.fragment);
    			t5 = space();
    			create_component(section5.$$.fragment);
    			t6 = space();
    			create_component(section6.$$.fragment);
    			t7 = space();
    			create_component(supplementary.$$.fragment);
    			t8 = space();
    			create_component(footer.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(header, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(main, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(section1, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(section2, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(section3, target, anchor);
    			insert_dev(target, t4, anchor);
    			mount_component(section4, target, anchor);
    			insert_dev(target, t5, anchor);
    			mount_component(section5, target, anchor);
    			insert_dev(target, t6, anchor);
    			mount_component(section6, target, anchor);
    			insert_dev(target, t7, anchor);
    			mount_component(supplementary, target, anchor);
    			insert_dev(target, t8, anchor);
    			mount_component(footer, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const main_changes = {};
    			if (dirty & /*title*/ 1) main_changes.title = /*title*/ ctx[0];
    			if (dirty & /*authors*/ 2) main_changes.authors = /*authors*/ ctx[1];
    			main.$set(main_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			transition_in(main.$$.fragment, local);
    			transition_in(section1.$$.fragment, local);
    			transition_in(section2.$$.fragment, local);
    			transition_in(section3.$$.fragment, local);
    			transition_in(section4.$$.fragment, local);
    			transition_in(section5.$$.fragment, local);
    			transition_in(section6.$$.fragment, local);
    			transition_in(supplementary.$$.fragment, local);
    			transition_in(footer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			transition_out(main.$$.fragment, local);
    			transition_out(section1.$$.fragment, local);
    			transition_out(section2.$$.fragment, local);
    			transition_out(section3.$$.fragment, local);
    			transition_out(section4.$$.fragment, local);
    			transition_out(section5.$$.fragment, local);
    			transition_out(section6.$$.fragment, local);
    			transition_out(supplementary.$$.fragment, local);
    			transition_out(footer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(header, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(main, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(section1, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(section2, detaching);
    			if (detaching) detach_dev(t3);
    			destroy_component(section3, detaching);
    			if (detaching) detach_dev(t4);
    			destroy_component(section4, detaching);
    			if (detaching) detach_dev(t5);
    			destroy_component(section5, detaching);
    			if (detaching) detach_dev(t6);
    			destroy_component(section6, detaching);
    			if (detaching) detach_dev(t7);
    			destroy_component(supplementary, detaching);
    			if (detaching) detach_dev(t8);
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

    	$$self.$capture_state = () => ({
    		Header,
    		Footer,
    		Main,
    		Section1,
    		Section2,
    		Section3,
    		Section4,
    		Section5,
    		Section6,
    		Supplementary,
    		title,
    		authors
    	});

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
    		detail: [
    			"Department of Computer and Information Science, University of Pennsylvania, Philadelphia, PA 19104",
    			"homahm@seas.upenn.edu"
    		]
    	},
    	{
    		name: "Amir Ghasemian",
    		detail: [
    			"Department of Statistics, Harvard University, Cambridge, MA 02138",
    			"Department of Statistical Science, Fox School of Business, Temple University, Philadelphia, PA 19122"
    		]
    	},
    	{
    		name: "Aaron Clauset",
    		detail: [
    			"Department of Computer Science, University of Colorado Boulder, Boulder, CO 80309",
    			"BioFrontiers Institute, University of Colorado Boulder, Boulder, CO 80303",
    			"Santa Fe Institute, Santa Fe, NM 87501"
    		]
    	},
    	{
    		name: "Markus Mobius",
    		detail: [
    			"Microsoft Research New England, Cambridge, MA 02142"
    		]
    	},
    	{
    		name: "David M. Rothschildh",
    		detail: [
    			"Microsoft Research New York, New York, NY 10012"
    		]
    	},
    	{
    		name: "Duncan J. Watts",
    		detail: [
    			"Department of Computer and Information Science, University of Pennsylvania, Philadelphia, PA 19104",
    			"The Annenberg School of Communication, University of Pennsylvania, Philadelphia, PA 19104",
    			"Operations, Information, and Decisions Department, University of Pennsylvania, Philadelphia, PA 19104",
    			"djwatts@seas.upenn.edu"
    		]
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
