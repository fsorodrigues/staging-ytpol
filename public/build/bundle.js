
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
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
            return noop;
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
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
    function set_store_value(store, ret, value) {
        store.set(value);
        return ret;
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
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
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
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
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
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

    const file$i = "src/components/header/Header.svelte";

    function create_fragment$j(ctx) {
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
    			add_location(img, file$i, 7, 16, 387);
    			attr_dev(a0, "class", "logo_anchor svelte-vklvp2");
    			attr_dev(a0, "href", "https://css.seas.upenn.edu/");
    			add_location(a0, file$i, 6, 12, 312);
    			attr_dev(div0, "class", "logo_container svelte-vklvp2");
    			add_location(div0, file$i, 4, 8, 216);
    			attr_dev(a1, "class", "menu-item-anchor svelte-vklvp2");
    			attr_dev(a1, "href", "https://css.seas.upenn.edu/about/");
    			add_location(a1, file$i, 14, 24, 841);
    			attr_dev(a2, "class", "sub-menu-item-anchor svelte-vklvp2");
    			attr_dev(a2, "href", "https://css.seas.upenn.edu/about/lab/");
    			add_location(a2, file$i, 17, 32, 1111);
    			attr_dev(li0, "class", "menu-item menu-item-type-post_type menu-item-object-page menu-item-1554 svelte-vklvp2");
    			add_location(li0, file$i, 16, 28, 994);
    			attr_dev(a3, "class", "sub-menu-item-anchor svelte-vklvp2");
    			attr_dev(a3, "href", "https://css.seas.upenn.edu/about/community/");
    			add_location(a3, file$i, 20, 32, 1379);
    			attr_dev(li1, "class", "menu-item menu-item-type-post_type menu-item-object-page menu-item-2232 svelte-vklvp2");
    			add_location(li1, file$i, 19, 28, 1262);
    			attr_dev(ul0, "class", "sub-menu svelte-vklvp2");
    			add_location(ul0, file$i, 15, 24, 944);
    			attr_dev(li2, "class", "menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children menu-item-2731 svelte-vklvp2");
    			add_location(li2, file$i, 13, 20, 710);
    			attr_dev(a4, "class", "menu-item-anchor svelte-vklvp2");
    			attr_dev(a4, "href", "https://css.seas.upenn.edu/people/");
    			add_location(a4, file$i, 25, 24, 1699);
    			attr_dev(li3, "class", "menu-item menu-item-type-post_type menu-item-object-page menu-item-1747 svelte-vklvp2");
    			add_location(li3, file$i, 24, 20, 1590);
    			attr_dev(a5, "class", "menu-item-anchor svelte-vklvp2");
    			attr_dev(a5, "href", "https://css.seas.upenn.edu/research/");
    			add_location(a5, file$i, 28, 24, 1956);
    			attr_dev(a6, "class", "sub-menu-item-anchor svelte-vklvp2");
    			attr_dev(a6, "href", "https://css.seas.upenn.edu/project/penn-map/");
    			add_location(a6, file$i, 31, 32, 2230);
    			attr_dev(li4, "class", "menu-item menu-item-type-custom menu-item-object-custom menu-item-735 svelte-vklvp2");
    			add_location(li4, file$i, 30, 28, 2115);
    			attr_dev(a7, "class", "sub-menu-item-anchor svelte-vklvp2");
    			attr_dev(a7, "href", "https://css.seas.upenn.edu/project/virtual-lab/");
    			add_location(a7, file$i, 34, 32, 2503);
    			attr_dev(li5, "class", "menu-item menu-item-type-custom menu-item-object-custom menu-item-292 svelte-vklvp2");
    			add_location(li5, file$i, 33, 28, 2388);
    			attr_dev(a8, "class", "sub-menu-item-anchor svelte-vklvp2");
    			attr_dev(a8, "href", "https://css.seas.upenn.edu/project/covid-philadelphia/");
    			add_location(a8, file$i, 37, 32, 2786);
    			attr_dev(li6, "class", "menu-item menu-item-type-custom menu-item-object-custom menu-item-291 svelte-vklvp2");
    			add_location(li6, file$i, 36, 28, 2671);
    			attr_dev(a9, "class", "sub-menu-item-anchor svelte-vklvp2");
    			attr_dev(a9, "href", "https://css.seas.upenn.edu/project/common-sense/");
    			add_location(a9, file$i, 40, 32, 3080);
    			attr_dev(li7, "class", "menu-item menu-item-type-custom menu-item-object-custom menu-item-377 svelte-vklvp2");
    			add_location(li7, file$i, 39, 28, 2965);
    			attr_dev(ul1, "class", "sub-menu svelte-vklvp2");
    			add_location(ul1, file$i, 29, 24, 2065);
    			attr_dev(li8, "class", "menu-item menu-item-type-post_type menu-item-object-page menu-item-has-children menu-item-37 svelte-vklvp2");
    			add_location(li8, file$i, 27, 20, 1826);
    			attr_dev(a10, "class", "menu-item-anchor svelte-vklvp2");
    			attr_dev(a10, "href", "https://css.seas.upenn.edu/partnerships/");
    			add_location(a10, file$i, 45, 24, 3403);
    			attr_dev(li9, "class", "menu-item menu-item-type-post_type menu-item-object-page menu-item-344 svelte-vklvp2");
    			add_location(li9, file$i, 44, 20, 3295);
    			attr_dev(a11, "class", "menu-item-anchor svelte-vklvp2");
    			attr_dev(a11, "href", "https://css.seas.upenn.edu/publications/");
    			add_location(a11, file$i, 48, 24, 3645);
    			attr_dev(li10, "class", "menu-item menu-item-type-post_type menu-item-object-page menu-item-58 svelte-vklvp2");
    			add_location(li10, file$i, 47, 20, 3538);
    			attr_dev(a12, "class", "menu-item-anchor svelte-vklvp2");
    			attr_dev(a12, "href", "https://css.seas.upenn.edu/blog-news-events/");
    			add_location(a12, file$i, 51, 24, 3892);
    			attr_dev(li11, "class", "menu-item menu-item-type-post_type menu-item-object-page menu-item-105 svelte-vklvp2");
    			add_location(li11, file$i, 50, 20, 3784);
    			attr_dev(ul2, "id", "top-menu");
    			attr_dev(ul2, "class", "nav svelte-vklvp2");
    			add_location(ul2, file$i, 12, 16, 659);
    			attr_dev(nav, "id", "top-menu-nav");
    			add_location(nav, file$i, 11, 12, 619);
    			attr_dev(div1, "id", "et-top-navigation");
    			add_location(div1, file$i, 10, 8, 578);
    			attr_dev(div2, "class", "container clearfix et_menu_container svelte-vklvp2");
    			add_location(div2, file$i, 3, 4, 157);
    			attr_dev(header, "id", "main-header");
    			attr_dev(header, "data-height-onload", "84");
    			attr_dev(header, "data-height-loaded", "true");
    			attr_dev(header, "data-fixed-height-onload", "84");
    			set_style(header, "top", "0px");
    			attr_dev(header, "class", "svelte-vklvp2");
    			add_location(header, file$i, 2, 0, 29);
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
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props) {
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
    		init(this, options, instance$j, create_fragment$j, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$j.name
    		});
    	}
    }

    /* src/components/footer/Footer.svelte generated by Svelte v3.49.0 */

    const file$h = "src/components/footer/Footer.svelte";

    function create_fragment$i(ctx) {
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
    			add_location(img0, file$h, 10, 32, 784);
    			attr_dev(span0, "class", "et_pb_image_wrap  svelte-11jfbp5");
    			add_location(span0, file$h, 9, 28, 719);
    			attr_dev(a0, "href", "https://www.seas.upenn.edu/");
    			attr_dev(a0, "target", "_blank");
    			attr_dev(a0, "class", "svelte-11jfbp5");
    			add_location(a0, file$h, 8, 24, 636);
    			attr_dev(div0, "class", "et_pb_module et_pb_image et_pb_image_0_tb_footer et_pb_image_sticky svelte-11jfbp5");
    			add_location(div0, file$h, 7, 20, 530);
    			attr_dev(img1, "loading", "lazy");
    			attr_dev(img1, "width", "480");
    			attr_dev(img1, "height", "123");
    			if (!src_url_equal(img1.src, img1_src_value = "https://css.seas.upenn.edu/wp-content/uploads/2022/04/newfooter-2-asc.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "Penn Engineering");
    			attr_dev(img1, "title", "Penn Engineering");
    			attr_dev(img1, "srcset", "https://css.seas.upenn.edu/wp-content/uploads/2022/04/newfooter-2-asc.png 480w, https://css.seas.upenn.edu/wp-content/uploads/2022/04/newfooter-2-asc-300x77.png 300w");
    			attr_dev(img1, "sizes", "(max-width: 480px) 100vw, 480px");
    			attr_dev(img1, "class", "wp-image-3440 svelte-11jfbp5");
    			add_location(img1, file$h, 26, 32, 1897);
    			attr_dev(span1, "class", "et_pb_image_wrap  svelte-11jfbp5");
    			add_location(span1, file$h, 25, 28, 1832);
    			attr_dev(a1, "href", "https://www.asc.upenn.edu/");
    			attr_dev(a1, "target", "_blank");
    			attr_dev(a1, "class", "svelte-11jfbp5");
    			add_location(a1, file$h, 24, 24, 1750);
    			attr_dev(div1, "class", "et_pb_module et_pb_image et_pb_image_1_tb_footer et_pb_image_sticky svelte-11jfbp5");
    			add_location(div1, file$h, 23, 20, 1644);
    			attr_dev(img2, "loading", "lazy");
    			attr_dev(img2, "width", "480");
    			attr_dev(img2, "height", "111");
    			if (!src_url_equal(img2.src, img2_src_value = "https://css.seas.upenn.edu/wp-content/uploads/2022/04/newfooter-3-wharton.png")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "Penn Engineering");
    			attr_dev(img2, "title", "Penn Engineering");
    			attr_dev(img2, "srcset", "https://css.seas.upenn.edu/wp-content/uploads/2022/04/newfooter-3-wharton.png 480w, https://css.seas.upenn.edu/wp-content/uploads/2022/04/newfooter-3-wharton-300x69.png 300w");
    			attr_dev(img2, "sizes", "(max-width: 480px) 100vw, 480px");
    			attr_dev(img2, "class", "wp-image-3439 svelte-11jfbp5");
    			add_location(img2, file$h, 42, 32, 3003);
    			attr_dev(span2, "class", "et_pb_image_wrap  svelte-11jfbp5");
    			add_location(span2, file$h, 41, 28, 2938);
    			attr_dev(a2, "href", "https://www.wharton.upenn.edu/");
    			attr_dev(a2, "target", "_blank");
    			attr_dev(a2, "class", "svelte-11jfbp5");
    			add_location(a2, file$h, 40, 24, 2852);
    			attr_dev(div2, "class", "et_pb_module et_pb_image et_pb_image_2_tb_footer et_pb_image_sticky svelte-11jfbp5");
    			add_location(div2, file$h, 39, 20, 2746);
    			attr_dev(div3, "class", "et_pb_column et_pb_column_1_4 et_pb_column_0_tb_footer global-footer-column-1 et_pb_css_mix_blend_mode_passthrough svelte-11jfbp5");
    			add_location(div3, file$h, 6, 16, 380);
    			attr_dev(h20, "class", "svelte-11jfbp5");
    			add_location(h20, file$h, 60, 24, 4229);
    			attr_dev(div4, "class", "et_pb_text_inner svelte-11jfbp5");
    			add_location(div4, file$h, 59, 20, 4174);
    			attr_dev(div5, "class", "et_pb_module et_pb_text et_pb_text_0_tb_footer et_pb_text_align_left et_pb_bg_layout_light svelte-11jfbp5");
    			add_location(div5, file$h, 58, 16, 4048);
    			attr_dev(div6, "class", "et_pb_divider_internal svelte-11jfbp5");
    			add_location(div6, file$h, 64, 20, 4436);
    			attr_dev(div7, "class", "et_pb_module et_pb_divider et_pb_divider_0_tb_footer et_pb_divider_position_ et_pb_space svelte-11jfbp5");
    			add_location(div7, file$h, 63, 16, 4313);
    			attr_dev(a3, "href", "https://css.seas.upenn.edu/about/");
    			attr_dev(a3, "class", "svelte-11jfbp5");
    			add_location(a3, file$h, 73, 44, 5270);
    			attr_dev(li0, "id", "menu-item-3425");
    			attr_dev(li0, "class", "et_pb_menu_page_id-2233 menu-item menu-item-type-post_type menu-item-object-page menu-item-3425 svelte-11jfbp5");
    			add_location(li0, file$h, 72, 40, 5097);
    			attr_dev(a4, "href", "https://css.seas.upenn.edu/people/");
    			attr_dev(a4, "class", "svelte-11jfbp5");
    			add_location(a4, file$h, 76, 44, 5583);
    			attr_dev(li1, "id", "menu-item-3426");
    			attr_dev(li1, "class", "et_pb_menu_page_id-1732 menu-item menu-item-type-post_type menu-item-object-page menu-item-3426 svelte-11jfbp5");
    			add_location(li1, file$h, 75, 40, 5410);
    			attr_dev(a5, "href", "https://css.seas.upenn.edu/research/");
    			attr_dev(a5, "class", "svelte-11jfbp5");
    			add_location(a5, file$h, 79, 44, 5896);
    			attr_dev(li2, "id", "menu-item-3430");
    			attr_dev(li2, "class", "et_pb_menu_page_id-22 menu-item menu-item-type-post_type menu-item-object-page menu-item-3430 svelte-11jfbp5");
    			add_location(li2, file$h, 78, 40, 5725);
    			attr_dev(a6, "href", "https://css.seas.upenn.edu/partnerships/");
    			attr_dev(a6, "class", "svelte-11jfbp5");
    			add_location(a6, file$h, 82, 44, 6213);
    			attr_dev(li3, "id", "menu-item-3428");
    			attr_dev(li3, "class", "et_pb_menu_page_id-65 menu-item menu-item-type-post_type menu-item-object-page menu-item-3428 svelte-11jfbp5");
    			add_location(li3, file$h, 81, 40, 6042);
    			attr_dev(a7, "href", "https://css.seas.upenn.edu/publications/");
    			attr_dev(a7, "class", "svelte-11jfbp5");
    			add_location(a7, file$h, 85, 44, 6534);
    			attr_dev(li4, "id", "menu-item-3429");
    			attr_dev(li4, "class", "et_pb_menu_page_id-52 menu-item menu-item-type-post_type menu-item-object-page menu-item-3429 svelte-11jfbp5");
    			add_location(li4, file$h, 84, 40, 6363);
    			attr_dev(a8, "href", "https://css.seas.upenn.edu/blog-news-events/");
    			attr_dev(a8, "class", "svelte-11jfbp5");
    			add_location(a8, file$h, 88, 44, 6859);
    			attr_dev(li5, "id", "menu-item-3427");
    			attr_dev(li5, "class", "et_pb_menu_page_id-92 menu-item menu-item-type-post_type menu-item-object-page menu-item-3427 svelte-11jfbp5");
    			add_location(li5, file$h, 87, 40, 6688);
    			attr_dev(ul, "id", "menu-footer-menu-new");
    			attr_dev(ul, "class", "et-menu nav svelte-11jfbp5");
    			add_location(ul, file$h, 71, 36, 5006);
    			attr_dev(nav, "class", "et-menu-nav svelte-11jfbp5");
    			add_location(nav, file$h, 70, 32, 4944);
    			attr_dev(div8, "class", "et_pb_menu__menu svelte-11jfbp5");
    			add_location(div8, file$h, 69, 28, 4881);
    			attr_dev(div9, "class", "et_pb_menu__wrap");
    			add_location(div9, file$h, 68, 24, 4822);
    			attr_dev(div10, "class", "et_pb_menu_inner_container clearfix");
    			add_location(div10, file$h, 67, 20, 4748);
    			attr_dev(div11, "class", "et_pb_module et_pb_menu et_pb_menu_0_tb_footer footer-vertical-menu et_pb_bg_layout_light et_pb_text_align_left et_dropdown_animation_fade et_pb_menu--without-logo et_pb_menu--style-left_aligned svelte-11jfbp5");
    			add_location(div11, file$h, 66, 16, 4518);
    			attr_dev(div12, "class", "et_pb_column et_pb_column_1_4 et_pb_column_1_tb_footer global-footer-column-2 et_pb_css_mix_blend_mode_passthrough et_pb_column--with-menu svelte-11jfbp5");
    			add_location(div12, file$h, 57, 12, 3878);
    			attr_dev(h21, "class", "svelte-11jfbp5");
    			add_location(h21, file$h, 101, 16, 7497);
    			attr_dev(div13, "class", "et_pb_text_inner svelte-11jfbp5");
    			add_location(div13, file$h, 100, 12, 7450);
    			attr_dev(div14, "class", "et_pb_module et_pb_text et_pb_text_1_tb_footer et_pb_text_align_left et_pb_bg_layout_light svelte-11jfbp5");
    			add_location(div14, file$h, 99, 8, 7332);
    			attr_dev(div15, "class", "et_pb_divider_internal svelte-11jfbp5");
    			add_location(div15, file$h, 105, 12, 7671);
    			attr_dev(div16, "class", "et_pb_module et_pb_divider et_pb_divider_1_tb_footer et_pb_divider_position_ et_pb_space svelte-11jfbp5");
    			add_location(div16, file$h, 104, 8, 7556);
    			add_location(br0, file$h, 109, 37, 7923);
    			add_location(br1, file$h, 109, 51, 7937);
    			attr_dev(p0, "class", "svelte-11jfbp5");
    			add_location(p0, file$h, 109, 16, 7902);
    			attr_dev(p1, "class", "svelte-11jfbp5");
    			add_location(p1, file$h, 110, 16, 7984);
    			attr_dev(p2, "class", "svelte-11jfbp5");
    			add_location(p2, file$h, 111, 16, 8029);
    			attr_dev(div17, "class", "et_pb_text_inner svelte-11jfbp5");
    			add_location(div17, file$h, 108, 12, 7855);
    			attr_dev(div18, "class", "et_pb_module et_pb_text et_pb_text_2_tb_footer et_pb_text_align_left et_pb_bg_layout_light svelte-11jfbp5");
    			add_location(div18, file$h, 107, 8, 7737);
    			attr_dev(div19, "class", "et_pb_column et_pb_column_1_4 et_pb_column_2_tb_footer global-footer-column-3 et_pb_css_mix_blend_mode_passthrough svelte-11jfbp5");
    			add_location(div19, file$h, 98, 4, 7194);
    			attr_dev(div20, "class", "et_pb_row et_pb_row_0_tb_footer et_pb_row--with-menu et_pb_row_4col svelte-11jfbp5");
    			set_style(div20, "z-index", "3");
    			add_location(div20, file$h, 5, 12, 262);
    			attr_dev(a9, "href", "https://www.upenn.edu/");
    			attr_dev(a9, "class", "svelte-11jfbp5");
    			add_location(a9, file$h, 134, 24, 9569);
    			attr_dev(a10, "href", "https://www.upenn.edu/about/disclaimer");
    			attr_dev(a10, "class", "svelte-11jfbp5");
    			add_location(a10, file$h, 135, 24, 9644);
    			attr_dev(a11, "href", "https://www.publicsafety.upenn.edu/contact/");
    			attr_dev(a11, "class", "svelte-11jfbp5");
    			add_location(a11, file$h, 136, 24, 9732);
    			attr_dev(a12, "href", "https://www.upenn.edu/about/privacy-policy");
    			attr_dev(a12, "class", "svelte-11jfbp5");
    			add_location(a12, file$h, 137, 24, 9833);
    			attr_dev(a13, "href", "https://accessibility.web-resources.upenn.edu/get-help");
    			attr_dev(a13, "class", "svelte-11jfbp5");
    			add_location(a13, file$h, 138, 24, 9929);
    			attr_dev(a14, "href", "https://www.upenn.edu/about/report-copyright-infringement");
    			attr_dev(a14, "class", "svelte-11jfbp5");
    			add_location(a14, file$h, 139, 24, 10063);
    			set_style(p3, "text-align", "center");
    			attr_dev(p3, "class", "svelte-11jfbp5");
    			add_location(p3, file$h, 133, 20, 9513);
    			attr_dev(div21, "class", "et_pb_text_inner svelte-11jfbp5");
    			add_location(div21, file$h, 132, 16, 9462);
    			attr_dev(div22, "class", "et_pb_module et_pb_text et_pb_text_4_tb_footer et_pb_text_align_left et_pb_bg_layout_light svelte-11jfbp5");
    			add_location(div22, file$h, 131, 12, 9340);
    			add_location(strong0, file$h, 145, 55, 10452);
    			add_location(em0, file$h, 145, 51, 10448);
    			set_style(p4, "text-align", "center");
    			attr_dev(p4, "class", "svelte-11jfbp5");
    			add_location(p4, file$h, 145, 20, 10417);
    			add_location(strong1, file$h, 146, 122, 10601);
    			attr_dev(a15, "href", "https://css.seas.upenn.edu/research-assistant-positions/");
    			attr_dev(a15, "class", "svelte-11jfbp5");
    			add_location(a15, file$h, 146, 55, 10534);
    			add_location(em1, file$h, 146, 51, 10530);
    			set_style(p5, "text-align", "center");
    			attr_dev(p5, "class", "svelte-11jfbp5");
    			add_location(p5, file$h, 146, 20, 10499);
    			attr_dev(div23, "class", "et_pb_text_inner svelte-11jfbp5");
    			add_location(div23, file$h, 144, 16, 10366);
    			attr_dev(div24, "class", "et_pb_module et_pb_text et_pb_text_5_tb_footer et_pb_text_align_left et_pb_bg_layout_light svelte-11jfbp5");
    			add_location(div24, file$h, 143, 12, 10244);
    			attr_dev(div25, "class", "et_pb_column et_pb_column_4_4 et_pb_column_4_tb_footer et_pb_css_mix_blend_mode_passthrough et-last-child");
    			add_location(div25, file$h, 130, 8, 9207);
    			attr_dev(div26, "class", "et_pb_row et_pb_row_1_tb_footer et_pb_equal_columns svelte-11jfbp5");
    			add_location(div26, file$h, 129, 4, 9133);
    			attr_dev(div27, "class", "et_pb_section et_pb_section_0_tb_footer et_pb_with_background et_section_regular et_pb_section--with-menu svelte-11jfbp5");
    			add_location(div27, file$h, 4, 8, 130);
    			attr_dev(div28, "class", "et_builder_inner_content et_pb_gutters3");
    			add_location(div28, file$h, 3, 4, 68);
    			attr_dev(footer, "class", "et-l et-l--footer svelte-11jfbp5");
    			add_location(footer, file$h, 2, 0, 29);
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
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props) {
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
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment$i.name
    		});
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

    function initRange(domain, range) {
      switch (arguments.length) {
        case 0: break;
        case 1: this.range(domain); break;
        default: this.range(range).domain(domain); break;
      }
      return this;
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

    var constant$1 = x => () => x;

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
        return b - a ? exponential(a, b, y) : constant$1(isNaN(a) ? b : a);
      };
    }

    function nogamma(a, b) {
      var d = b - a;
      return d ? linear$1(a, d) : constant$1(isNaN(a) ? b : a);
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
      return b == null || t === "boolean" ? constant$1(b)
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
    function writable(value, start = noop) {
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
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
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
            let cleanup = noop;
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
                    cleanup = is_function(result) ? result : noop;
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

    const { Object: Object_1$2, console: console_1$1 } = globals;
    const file$g = "node_modules/layercake/LayerCake.svelte";

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
    function create_if_block$9(ctx) {
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
    			add_location(div, file$g, 370, 1, 19795);
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
    		id: create_if_block$9.name,
    		type: "if",
    		source: "(370:0) {#if (ssr === true || typeof window !== 'undefined')}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$h(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = (/*ssr*/ ctx[3] === true || typeof window !== 'undefined') && create_if_block$9(ctx);

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
    					if_block = create_if_block$9(ctx);
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
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
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

    	Object_1$2.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<LayerCake> was created with unknown prop '${key}'`);
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
    			instance$h,
    			create_fragment$h,
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
    			id: create_fragment$h.name
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
    const file$f = "node_modules/layercake/layouts/Html.svelte";
    const get_default_slot_changes$3 = dirty => ({ element: dirty & /*element*/ 1 });
    const get_default_slot_context$3 = ctx => ({ element: /*element*/ ctx[0] });

    function create_fragment$g(ctx) {
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
    			add_location(div, file$f, 19, 0, 512);
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
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, { element: 0, zIndex: 1, pointerEvents: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Html",
    			options,
    			id: create_fragment$g.name
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
    const file$e = "node_modules/layercake/layouts/Svg.svelte";
    const get_default_slot_changes$2 = dirty => ({ element: dirty & /*element*/ 1 });
    const get_default_slot_context$2 = ctx => ({ element: /*element*/ ctx[0] });
    const get_defs_slot_changes = dirty => ({ element: dirty & /*element*/ 1 });
    const get_defs_slot_context = ctx => ({ element: /*element*/ ctx[0] });

    function create_fragment$f(ctx) {
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
    			add_location(defs, file$e, 33, 1, 992);
    			attr_dev(g, "class", "layercake-layout-svg_g");
    			attr_dev(g, "transform", g_transform_value = "translate(" + /*$padding*/ ctx[7].left + ", " + /*$padding*/ ctx[7].top + ")");
    			add_location(g, file$e, 36, 1, 1037);
    			attr_dev(svg, "class", "layercake-layout-svg svelte-u84d8d");
    			attr_dev(svg, "viewBox", /*viewBox*/ ctx[4]);
    			attr_dev(svg, "width", /*$containerWidth*/ ctx[5]);
    			attr_dev(svg, "height", /*$containerHeight*/ ctx[6]);
    			set_style(svg, "z-index", /*zIndex*/ ctx[2], false);
    			set_style(svg, "pointer-events", /*pointerEvents*/ ctx[3] === false ? 'none' : null, false);
    			add_location(svg, file$e, 24, 0, 782);
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
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
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

    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {
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
    			id: create_fragment$f.name
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

    const labelMap = new Map([
        ['fL', "Far Left"],
        ['L', "Left"],
        ['C', "Center"],
        ['AW', "Anti-woke"],
        ['R', "Right"],
        ["fR", "Far Right"]
    ]);
    const channelMap = new Map([
        ['channel_name', "Channel"],
        ['cluster', "Cluster"],
        ['subscribers', "Subscribers"],
        ['total_views', "Views"],
        ['total_videos', "Videos"]
    ]);

    const colorMap = new Map([
        ['fL', "#336084"],
        ['L', "#98BBD7"],
        ['C', "#A9A9A9"],
        ['AW', "#C19AC1"],
        ['R', "#CF6363"],
        ["fR", "#AC3535"],
    ]);

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

    /* src/components/graphs/atoms/AxisX.svelte generated by Svelte v3.49.0 */
    const file$d = "src/components/graphs/atoms/AxisX.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[19] = list[i];
    	child_ctx[21] = i;
    	return child_ctx;
    }

    // (54:6) {#if gridlines !== false}
    function create_if_block_2(ctx) {
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
    			add_location(line, file$d, 54, 8, 2092);
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
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(54:6) {#if gridlines !== false}",
    		ctx
    	});

    	return block;
    }

    // (57:6) {#if tickMarks === true}
    function create_if_block_1$5(ctx) {
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

    			add_location(line, file$d, 57, 8, 2215);
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
    		id: create_if_block_1$5.name,
    		type: "if",
    		source: "(57:6) {#if tickMarks === true}",
    		ctx
    	});

    	return block;
    }

    // (52:2) {#each tickVals as tick, i}
    function create_each_block$4(ctx) {
    	let g;
    	let if_block0_anchor;
    	let text_1;
    	let t_value = /*formatTick*/ ctx[4](/*tick*/ ctx[19]) + "";
    	let t;
    	let text_1_x_value;
    	let g_transform_value;
    	let if_block0 = /*gridlines*/ ctx[0] !== false && create_if_block_2(ctx);
    	let if_block1 = /*tickMarks*/ ctx[1] === true && create_if_block_1$5(ctx);

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
    			add_location(text_1, file$d, 59, 6, 2399);
    			attr_dev(g, "class", "tick tick-" + /*i*/ ctx[21] + " svelte-11s23aw");
    			attr_dev(g, "transform", g_transform_value = "translate(" + /*$xScale*/ ctx[8](/*tick*/ ctx[19]) + "," + /*$yRange*/ ctx[10][0] + ")");
    			add_location(g, file$d, 52, 4, 1972);
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
    					if_block0 = create_if_block_2(ctx);
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
    					if_block1 = create_if_block_1$5(ctx);
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
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(52:2) {#each tickVals as tick, i}",
    		ctx
    	});

    	return block;
    }

    // (68:2) {#if baseline === true}
    function create_if_block$8(ctx) {
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
    			add_location(line, file$d, 68, 4, 2631);
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
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(68:2) {#if baseline === true}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$e(ctx) {
    	let g;
    	let each_1_anchor;
    	let each_value = /*tickVals*/ ctx[9];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
    	}

    	let if_block = /*baseline*/ ctx[2] === true && create_if_block$8(ctx);

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
    			add_location(g, file$d, 50, 0, 1898);
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
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
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
    					if_block = create_if_block$8(ctx);
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
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(g);
    			destroy_each(each_blocks, detaching);
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

    function instance$e($$self, $$props, $$invalidate) {
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

    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {
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
    			id: create_fragment$e.name
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
    const file$c = "src/components/graphs/atoms/AxisY.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[17] = list[i];
    	return child_ctx;
    }

    // (46:8) {#if gridlines !== false}
    function create_if_block_1$4(ctx) {
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

    			add_location(line, file$c, 46, 10, 2358);
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
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(46:8) {#if gridlines !== false}",
    		ctx
    	});

    	return block;
    }

    // (54:8) {#if tickMarks === true}
    function create_if_block$7(ctx) {
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

    			add_location(line, file$c, 54, 10, 2633);
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
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(54:8) {#if tickMarks === true}",
    		ctx
    	});

    	return block;
    }

    // (44:4) {#each tickVals as tick}
    function create_each_block$3(ctx) {
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
    	let if_block0 = /*gridlines*/ ctx[0] !== false && create_if_block_1$4(ctx);
    	let if_block1 = /*tickMarks*/ ctx[1] === true && create_if_block$7(ctx);

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
    			add_location(text_1, file$c, 62, 8, 2911);
    			attr_dev(g, "class", g_class_value = "tick tick-" + /*tick*/ ctx[17] + " svelte-sctg30");
    			attr_dev(g, "transform", g_transform_value = "translate(" + (/*$xRange*/ ctx[12][0] + (/*isBandwidth*/ ctx[8] ? /*$padding*/ ctx[11].left : 0)) + ", " + /*$yScale*/ ctx[9](/*tick*/ ctx[17]) + ")");
    			add_location(g, file$c, 44, 6, 2196);
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
    					if_block0 = create_if_block_1$4(ctx);
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
    					if_block1 = create_if_block$7(ctx);
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
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(44:4) {#each tickVals as tick}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let g;
    	let g_transform_value;
    	let each_value = /*tickVals*/ ctx[10];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			g = svg_element("g");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(g, "class", "axis y-axis");
    			attr_dev(g, "transform", g_transform_value = "translate(" + -/*$padding*/ ctx[11].left + ", 0)");
    			add_location(g, file$c, 42, 2, 2094);
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
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
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
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(g);
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

    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {
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
    			id: create_fragment$d.name
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

    const { Object: Object_1$1 } = globals;
    const file$b = "src/components/graphs/tooltips/QuadtreeTooltip.svelte";

    const get_default_slot_changes$1 = dirty => ({
    	x: dirty & /*xGetter, found*/ 10,
    	y: dirty & /*yGetter, found*/ 9,
    	found: dirty & /*found*/ 8,
    	visible: dirty & /*visible*/ 4,
    	e: dirty & /*e*/ 16
    });

    const get_default_slot_context$1 = ctx => ({
    	x: /*xGetter*/ ctx[1](/*found*/ ctx[3]) || 0,
    	y: /*yGetter*/ ctx[0](/*found*/ ctx[3]) || 0,
    	found: /*found*/ ctx[3],
    	visible: /*visible*/ ctx[2],
    	e: /*e*/ ctx[4]
    });

    function create_fragment$c(ctx) {
    	let div;
    	let t;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[21].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[20], get_default_slot_context$1);

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = space();
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "bg svelte-6gdbom");
    			add_location(div, file$b, 58, 2, 2429);
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
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[20], dirty, get_default_slot_changes$1),
    						get_default_slot_context$1
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
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
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

    	Object_1$1.keys($$props).forEach(key => {
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

    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {
    			x: 11,
    			y: 12,
    			searchRadius: 13,
    			dataset: 14
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "QuadtreeTooltip",
    			options,
    			id: create_fragment$c.name
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

    /* src/components/graphs/atoms/Caption.svelte generated by Svelte v3.49.0 */

    const file$a = "src/components/graphs/atoms/Caption.svelte";

    function create_fragment$b(ctx) {
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
    			add_location(span, file$a, 6, 4, 123);
    			attr_dev(path, "d", "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4");
    			add_location(path, file$a, 8, 236, 457);
    			attr_dev(polyline, "points", "7 10 12 15 17 10");
    			add_location(polyline, file$a, 8, 295, 516);
    			attr_dev(line, "x1", "12");
    			attr_dev(line, "y1", "15");
    			attr_dev(line, "x2", "12");
    			attr_dev(line, "y2", "3");
    			add_location(line, file$a, 8, 342, 563);
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
    			add_location(svg, file$a, 8, 22, 243);
    			attr_dev(a, "class", "download-button svelte-1m1lkwz");
    			attr_dev(a, "href", /*url*/ ctx[1]);
    			attr_dev(a, "download", "");
    			add_location(a, file$a, 7, 4, 173);
    			attr_dev(div, "class", div_class_value = "caption caption-" + /*type*/ ctx[2] + " svelte-1m1lkwz");
    			add_location(div, file$a, 5, 0, 82);
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
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
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
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, { caption: 0, url: 1, type: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Caption",
    			options,
    			id: create_fragment$b.name
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

    const formatThousands = format(',.0s');
    const formatThousandsComma = format(',.0f');

    /* src/components/graphs/atoms/Line.svelte generated by Svelte v3.49.0 */
    const file$9 = "src/components/graphs/atoms/Line.svelte";

    function create_fragment$a(ctx) {
    	let path_1;
    	let path_1_d_value;

    	const block = {
    		c: function create() {
    			path_1 = svg_element("path");
    			attr_dev(path_1, "class", "path-line svelte-1qmqbsf");
    			attr_dev(path_1, "d", path_1_d_value = /*path*/ ctx[1](/*$data*/ ctx[2]));
    			attr_dev(path_1, "stroke", /*stroke*/ ctx[0]);
    			add_location(path_1, file$9, 10, 0, 281);
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
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(path_1);
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
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, { stroke: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Line",
    			options,
    			id: create_fragment$a.name
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
    const file$8 = "src/components/graphs/tooltips/SingleLineTooltip.svelte";

    function get_context(ctx) {
    	const constants_0 = /*found*/ ctx[17];
    	ctx[19] = constants_0;
    }

    // (80:4) {#if visible === true}
    function create_if_block$6(ctx) {
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
    			add_location(div0, file$8, 80, 6, 2412);
    			attr_dev(div1, "class", "title svelte-zx4q6d");
    			add_location(div1, file$8, 91, 10, 2685);
    			attr_dev(div2, "class", "row");
    			add_location(div2, file$8, 92, 10, 2758);
    			attr_dev(div3, "class", "tooltip svelte-zx4q6d");
    			set_style(div3, "width", w + "px");
    			set_style(div3, "display", /*visible*/ ctx[16] ? 'block' : 'none');
    			set_style(div3, "left", Math.min(Math.max(/*w2*/ ctx[9], /*x*/ ctx[14]), /*$width*/ ctx[4] - /*w2*/ ctx[9]) + "px");
    			add_location(div3, file$8, 84, 6, 2486);
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
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(80:4) {#if visible === true}",
    		ctx
    	});

    	return block;
    }

    // (70:2) <QuadTree     dataset={dataset || $data}     y='x'     let:x     let:y     let:visible     let:found     let:e   >
    function create_default_slot$2(ctx) {
    	get_context(ctx);
    	let if_block_anchor;
    	let if_block = /*visible*/ ctx[16] === true && create_if_block$6(ctx);

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
    					if_block = create_if_block$6(ctx);
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
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(70:2) <QuadTree     dataset={dataset || $data}     y='x'     let:x     let:y     let:visible     let:found     let:e   >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let quadtree;
    	let current;

    	quadtree = new QuadtreeTooltip({
    			props: {
    				dataset: /*dataset*/ ctx[2] || /*$data*/ ctx[3],
    				y: "x",
    				$$slots: {
    					default: [
    						create_default_slot$2,
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
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const w = 150;

    function instance$9($$self, $$props, $$invalidate) {
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

    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {
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
    			id: create_fragment$9.name
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
    const file$7 = "src/components/graphs/SingleLineChart.svelte";

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
    function create_default_slot_1$1(ctx) {
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
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(52:3) <Html>",
    		ctx
    	});

    	return block;
    }

    // (28:2) <LayerCake    padding={{ top: 20, right: 10, bottom: 20, left: 45 }}    { data }    x={ xKey }    xScale={ xKey === 'date' ? scaleTime() : scaleLinear() }    y={ yKey }    { yDomain }    yNice={ true }   >
    function create_default_slot$1(ctx) {
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
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(28:2) <LayerCake    padding={{ top: 20, right: 10, bottom: 20, left: 45 }}    { data }    x={ xKey }    xScale={ xKey === 'date' ? scaleTime() : scaleLinear() }    y={ yKey }    { yDomain }    yNice={ true }   >",
    		ctx
    	});

    	return block;
    }

    // (62:1) {#if includeCaption}
    function create_if_block$5(ctx) {
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
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(62:1) {#if includeCaption}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
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
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let if_block = /*includeCaption*/ ctx[8] && create_if_block$5(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			create_component(layercake.$$.fragment);
    			t = space();
    			if (if_block) if_block.c();
    			attr_dev(div0, "class", "chart line-chart");
    			add_location(div0, file$7, 26, 1, 858);
    			attr_dev(div1, "class", div1_class_value = "" + (null_to_empty(`chart-wrapper ${/*spanCol*/ ctx[9] === 12 ? 'split-cols' : 'single-cols'}`) + " svelte-1c7of4m"));
    			attr_dev(div1, "style", div1_style_value = `--spanCol: ${/*spanCol*/ ctx[9]}`);
    			add_location(div1, file$7, 22, 0, 741);
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
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
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

    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {
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
    			id: create_fragment$8.name
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

    /* src/components/table/Sort.svelte generated by Svelte v3.49.0 */
    const file$6 = "src/components/table/Sort.svelte";

    // (60:4) {:else}
    function create_else_block$3(ctx) {
    	let span;
    	let raw_value = /*labels*/ ctx[1].unsorted.html + "";
    	let span_title_value;

    	const block = {
    		c: function create() {
    			span = element("span");
    			attr_dev(span, "title", span_title_value = /*labels*/ ctx[1].unsorted.title);
    			add_location(span, file$6, 60, 6, 1395);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			span.innerHTML = raw_value;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*labels*/ 2 && raw_value !== (raw_value = /*labels*/ ctx[1].unsorted.html + "")) span.innerHTML = raw_value;
    			if (dirty & /*labels*/ 2 && span_title_value !== (span_title_value = /*labels*/ ctx[1].unsorted.title)) {
    				attr_dev(span, "title", span_title_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(60:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (56:29) 
    function create_if_block_1$3(ctx) {
    	let span;
    	let raw_value = /*labels*/ ctx[1].desc.html + "";
    	let span_title_value;

    	const block = {
    		c: function create() {
    			span = element("span");
    			attr_dev(span, "title", span_title_value = /*labels*/ ctx[1].desc.title);
    			add_location(span, file$6, 56, 6, 1297);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			span.innerHTML = raw_value;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*labels*/ 2 && raw_value !== (raw_value = /*labels*/ ctx[1].desc.html + "")) span.innerHTML = raw_value;
    			if (dirty & /*labels*/ 2 && span_title_value !== (span_title_value = /*labels*/ ctx[1].desc.title)) {
    				attr_dev(span, "title", span_title_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(56:29) ",
    		ctx
    	});

    	return block;
    }

    // (52:4) {#if dir === 'asc'}
    function create_if_block$4(ctx) {
    	let span;
    	let raw_value = /*labels*/ ctx[1].asc.html + "";
    	let span_title_value;

    	const block = {
    		c: function create() {
    			span = element("span");
    			attr_dev(span, "title", span_title_value = /*labels*/ ctx[1].asc.title);
    			add_location(span, file$6, 52, 6, 1183);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			span.innerHTML = raw_value;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*labels*/ 2 && raw_value !== (raw_value = /*labels*/ ctx[1].asc.html + "")) span.innerHTML = raw_value;
    			if (dirty & /*labels*/ 2 && span_title_value !== (span_title_value = /*labels*/ ctx[1].asc.title)) {
    				attr_dev(span, "title", span_title_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(52:4) {#if dir === 'asc'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let span;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*dir*/ ctx[0] === 'asc') return create_if_block$4;
    		if (/*dir*/ ctx[0] === 'desc') return create_if_block_1$3;
    		return create_else_block$3;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			span = element("span");
    			if_block.c();
    			attr_dev(span, "class", "sort svelte-1mzyjdu");
    			add_location(span, file$6, 50, 2, 1114);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			if_block.m(span, null);

    			if (!mounted) {
    				dispose = listen_dev(span, "click", /*onClick*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(span, null);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if_block.d();
    			mounted = false;
    			dispose();
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

    let globalLabels$3;

    function setLabels$2(labels) {
    	globalLabels$3 = labels;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Sort', slots, []);
    	const dispatch = createEventDispatcher();
    	const stateContext = getContext("state");
    	let { dir = "none" } = $$props;
    	let { key } = $$props;

    	let { labels = {
    		asc: { title: "Ascending", html: "&#8593;" },
    		desc: { title: "Desceding", html: "&#8595;" },
    		unsorted: { title: "Unsorted", html: "&#8645;" },
    		...globalLabels$3
    	} } = $$props;

    	function onClick(event) {
    		const state = stateContext.getState();

    		const detail = {
    			originalEvent: event,
    			key,
    			dir: dir !== "desc" ? "desc" : "asc",
    			rows: state.filteredRows
    		};

    		dispatch("sort", detail);

    		if (detail.preventDefault !== true) {
    			$$invalidate(0, dir = detail.dir);
    		}

    		stateContext.setRows(detail.rows);
    	}

    	const writable_props = ['dir', 'key', 'labels'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Sort> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('dir' in $$props) $$invalidate(0, dir = $$props.dir);
    		if ('key' in $$props) $$invalidate(3, key = $$props.key);
    		if ('labels' in $$props) $$invalidate(1, labels = $$props.labels);
    	};

    	$$self.$capture_state = () => ({
    		globalLabels: globalLabels$3,
    		setLabels: setLabels$2,
    		createEventDispatcher,
    		getContext,
    		dispatch,
    		stateContext,
    		dir,
    		key,
    		labels,
    		onClick
    	});

    	$$self.$inject_state = $$props => {
    		if ('dir' in $$props) $$invalidate(0, dir = $$props.dir);
    		if ('key' in $$props) $$invalidate(3, key = $$props.key);
    		if ('labels' in $$props) $$invalidate(1, labels = $$props.labels);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [dir, labels, onClick, key];
    }

    class Sort extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { dir: 0, key: 3, labels: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Sort",
    			options,
    			id: create_fragment$7.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*key*/ ctx[3] === undefined && !('key' in props)) {
    			console.warn("<Sort> was created without expected prop 'key'");
    		}
    	}

    	get dir() {
    		throw new Error("<Sort>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dir(value) {
    		throw new Error("<Sort>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get key() {
    		throw new Error("<Sort>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set key(value) {
    		throw new Error("<Sort>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get labels() {
    		throw new Error("<Sort>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labels(value) {
    		throw new Error("<Sort>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/table/Search.svelte generated by Svelte v3.49.0 */
    const file$5 = "src/components/table/Search.svelte";

    function create_fragment$6(ctx) {
    	let div;
    	let input;
    	let input_title_value;
    	let input_placeholder_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			input = element("input");
    			attr_dev(input, "type", "search");
    			attr_dev(input, "title", input_title_value = /*labels*/ ctx[1].placeholder);
    			attr_dev(input, "placeholder", input_placeholder_value = /*labels*/ ctx[1].placeholder);
    			attr_dev(input, "class", "svelte-b99s1f");
    			add_location(input, file$5, 83, 4, 1834);
    			attr_dev(div, "class", "search svelte-b99s1f");
    			add_location(div, file$5, 82, 2, 1809);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, input);
    			set_input_value(input, /*text*/ ctx[0]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[5]),
    					listen_dev(input, "keyup", /*onSearch*/ ctx[2], false, false, false),
    					listen_dev(input, "input", /*onSearch*/ ctx[2], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*labels*/ 2 && input_title_value !== (input_title_value = /*labels*/ ctx[1].placeholder)) {
    				attr_dev(input, "title", input_title_value);
    			}

    			if (dirty & /*labels*/ 2 && input_placeholder_value !== (input_placeholder_value = /*labels*/ ctx[1].placeholder)) {
    				attr_dev(input, "placeholder", input_placeholder_value);
    			}

    			if (dirty & /*text*/ 1) {
    				set_input_value(input, /*text*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
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

    let globalLabels$2;

    function setLabels$1(labels) {
    	globalLabels$2 = labels;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Search', slots, []);
    	const dispatch = createEventDispatcher();
    	const stateContext = getContext("state");

    	let { filter = (row, text, index) => {
    		text = text.toLowerCase();

    		// for (let i in row) {
    		if (row.channel_name.toString().toLowerCase().indexOf(text) > -1) {
    			return true;
    		}

    		// }
    		return false;
    	} } = $$props;

    	let { index = -1 } = $$props;
    	let { text = "" } = $$props;
    	let { labels = { placeholder: "Search", ...globalLabels$2 } } = $$props;

    	async function onSearch(event) {
    		const state = stateContext.getState();

    		const detail = {
    			originalEvent: event,
    			filter,
    			index,
    			text,
    			page: state.page,
    			pageIndex: state.pageIndex,
    			pageSize: state.pageSize,
    			rows: state.filteredRows
    		};

    		dispatch("search", detail);

    		if (detail.preventDefault !== true) {
    			if (detail.text.length === 0) {
    				stateContext.setRows(state.rows);
    			} else {
    				stateContext.setRows(detail.rows.filter(r => detail.filter(r, detail.text, index)));
    			}

    			stateContext.setPage(0, 0);
    		} else {
    			stateContext.setRows(detail.rows);
    		}
    	}

    	const writable_props = ['filter', 'index', 'text', 'labels'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Search> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		text = this.value;
    		$$invalidate(0, text);
    	}

    	$$self.$$set = $$props => {
    		if ('filter' in $$props) $$invalidate(3, filter = $$props.filter);
    		if ('index' in $$props) $$invalidate(4, index = $$props.index);
    		if ('text' in $$props) $$invalidate(0, text = $$props.text);
    		if ('labels' in $$props) $$invalidate(1, labels = $$props.labels);
    	};

    	$$self.$capture_state = () => ({
    		globalLabels: globalLabels$2,
    		setLabels: setLabels$1,
    		createEventDispatcher,
    		getContext,
    		dispatch,
    		stateContext,
    		filter,
    		index,
    		text,
    		labels,
    		onSearch
    	});

    	$$self.$inject_state = $$props => {
    		if ('filter' in $$props) $$invalidate(3, filter = $$props.filter);
    		if ('index' in $$props) $$invalidate(4, index = $$props.index);
    		if ('text' in $$props) $$invalidate(0, text = $$props.text);
    		if ('labels' in $$props) $$invalidate(1, labels = $$props.labels);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [text, labels, onSearch, filter, index, input_input_handler];
    }

    class Search extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { filter: 3, index: 4, text: 0, labels: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Search",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get filter() {
    		throw new Error("<Search>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set filter(value) {
    		throw new Error("<Search>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get index() {
    		throw new Error("<Search>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set index(value) {
    		throw new Error("<Search>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get text() {
    		throw new Error("<Search>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<Search>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get labels() {
    		throw new Error("<Search>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labels(value) {
    		throw new Error("<Search>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/table/Row.svelte generated by Svelte v3.49.0 */
    const file$4 = "src/components/table/Row.svelte";

    function create_fragment$5(ctx) {
    	let tr;
    	let tr_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			if (default_slot) default_slot.c();
    			attr_dev(tr, "class", tr_class_value = "" + (null_to_empty(`row ${/*$$props*/ ctx[2].class}`) + " svelte-1y250wp"));
    			toggle_class(tr, "odd", /*index*/ ctx[0] % 2 !== 0);
    			toggle_class(tr, "even", /*index*/ ctx[0] % 2 === 0);
    			add_location(tr, file$4, 21, 2, 360);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);

    			if (default_slot) {
    				default_slot.m(tr, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(tr, "click", /*onClick*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[3],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[3])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[3], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*$$props*/ 4 && tr_class_value !== (tr_class_value = "" + (null_to_empty(`row ${/*$$props*/ ctx[2].class}`) + " svelte-1y250wp"))) {
    				attr_dev(tr, "class", tr_class_value);
    			}

    			if (dirty & /*$$props, index*/ 5) {
    				toggle_class(tr, "odd", /*index*/ ctx[0] % 2 !== 0);
    			}

    			if (dirty & /*$$props, index*/ 5) {
    				toggle_class(tr, "even", /*index*/ ctx[0] % 2 === 0);
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
    			if (detaching) detach_dev(tr);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
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

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Row', slots, ['default']);
    	const dispatch = createEventDispatcher();
    	let { index = 0 } = $$props;

    	function onClick(event) {
    		dispatch("click", event);
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(2, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ('index' in $$new_props) $$invalidate(0, index = $$new_props.index);
    		if ('$$scope' in $$new_props) $$invalidate(3, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		dispatch,
    		index,
    		onClick
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(2, $$props = assign(assign({}, $$props), $$new_props));
    		if ('index' in $$props) $$invalidate(0, index = $$new_props.index);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$props = exclude_internal_props($$props);
    	return [index, onClick, $$props, $$scope, slots];
    }

    class Row extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { index: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Row",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get index() {
    		throw new Error("<Row>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set index(value) {
    		throw new Error("<Row>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/table/Pagination.svelte generated by Svelte v3.49.0 */
    const file$3 = "src/components/table/Pagination.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[15] = list[i];
    	return child_ctx;
    }

    // (86:6) {#if page + button >= 0 && page + button <= pageCount}
    function create_if_block$3(ctx) {
    	let li;
    	let button;
    	let t_value = /*page*/ ctx[1] + /*button*/ ctx[15] + 1 + "";
    	let t;
    	let mounted;
    	let dispose;

    	function click_handler_2(...args) {
    		return /*click_handler_2*/ ctx[10](/*button*/ ctx[15], ...args);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			button = element("button");
    			t = text$1(t_value);
    			attr_dev(button, "class", "svelte-1klt193");
    			toggle_class(button, "active", /*page*/ ctx[1] === /*page*/ ctx[1] + /*button*/ ctx[15]);
    			add_location(button, file$3, 87, 10, 1905);
    			add_location(li, file$3, 86, 8, 1890);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, button);
    			append_dev(button, t);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler_2, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*page, buttons*/ 3 && t_value !== (t_value = /*page*/ ctx[1] + /*button*/ ctx[15] + 1 + "")) set_data_dev(t, t_value);

    			if (dirty & /*page, buttons*/ 3) {
    				toggle_class(button, "active", /*page*/ ctx[1] === /*page*/ ctx[1] + /*button*/ ctx[15]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(86:6) {#if page + button >= 0 && page + button <= pageCount}",
    		ctx
    	});

    	return block;
    }

    // (85:4) {#each buttons as button}
    function create_each_block$2(ctx) {
    	let if_block_anchor;
    	let if_block = /*page*/ ctx[1] + /*button*/ ctx[15] >= 0 && /*page*/ ctx[1] + /*button*/ ctx[15] <= /*pageCount*/ ctx[3] && create_if_block$3(ctx);

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
    			if (/*page*/ ctx[1] + /*button*/ ctx[15] >= 0 && /*page*/ ctx[1] + /*button*/ ctx[15] <= /*pageCount*/ ctx[3]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$3(ctx);
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
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(85:4) {#each buttons as button}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let ul;
    	let li0;
    	let button0;
    	let t0_value = /*labels*/ ctx[2].first + "";
    	let t0;
    	let button0_disabled_value;
    	let t1;
    	let li1;
    	let button1;
    	let t2_value = /*labels*/ ctx[2].previous + "";
    	let t2;
    	let button1_disabled_value;
    	let t3;
    	let t4;
    	let li2;
    	let button2;
    	let t5_value = /*labels*/ ctx[2].next + "";
    	let t5;
    	let button2_disabled_value;
    	let t6;
    	let li3;
    	let button3;
    	let t7_value = /*labels*/ ctx[2].last + "";
    	let t7;
    	let button3_disabled_value;
    	let mounted;
    	let dispose;
    	let each_value = /*buttons*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			ul = element("ul");
    			li0 = element("li");
    			button0 = element("button");
    			t0 = text$1(t0_value);
    			t1 = space();
    			li1 = element("li");
    			button1 = element("button");
    			t2 = text$1(t2_value);
    			t3 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t4 = space();
    			li2 = element("li");
    			button2 = element("button");
    			t5 = text$1(t5_value);
    			t6 = space();
    			li3 = element("li");
    			button3 = element("button");
    			t7 = text$1(t7_value);
    			button0.disabled = button0_disabled_value = /*page*/ ctx[1] === 0;
    			attr_dev(button0, "class", "svelte-1klt193");
    			add_location(button0, file$3, 75, 6, 1544);
    			add_location(li0, file$3, 74, 4, 1533);
    			button1.disabled = button1_disabled_value = /*page*/ ctx[1] === 0;
    			attr_dev(button1, "class", "svelte-1klt193");
    			add_location(button1, file$3, 80, 6, 1670);
    			add_location(li1, file$3, 79, 4, 1659);
    			button2.disabled = button2_disabled_value = /*page*/ ctx[1] > /*pageCount*/ ctx[3] - 1;
    			attr_dev(button2, "class", "svelte-1klt193");
    			add_location(button2, file$3, 96, 6, 2124);
    			add_location(li2, file$3, 95, 4, 2113);
    			button3.disabled = button3_disabled_value = /*page*/ ctx[1] >= /*pageCount*/ ctx[3];
    			attr_dev(button3, "class", "svelte-1klt193");
    			add_location(button3, file$3, 103, 6, 2282);
    			add_location(li3, file$3, 102, 4, 2271);
    			attr_dev(ul, "class", "svelte-1klt193");
    			add_location(ul, file$3, 73, 2, 1524);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);
    			append_dev(ul, li0);
    			append_dev(li0, button0);
    			append_dev(button0, t0);
    			append_dev(ul, t1);
    			append_dev(ul, li1);
    			append_dev(li1, button1);
    			append_dev(button1, t2);
    			append_dev(ul, t3);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			append_dev(ul, t4);
    			append_dev(ul, li2);
    			append_dev(li2, button2);
    			append_dev(button2, t5);
    			append_dev(ul, t6);
    			append_dev(ul, li3);
    			append_dev(li3, button3);
    			append_dev(button3, t7);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler*/ ctx[8], false, false, false),
    					listen_dev(button1, "click", /*click_handler_1*/ ctx[9], false, false, false),
    					listen_dev(button2, "click", /*click_handler_3*/ ctx[11], false, false, false),
    					listen_dev(button3, "click", /*click_handler_4*/ ctx[12], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*labels*/ 4 && t0_value !== (t0_value = /*labels*/ ctx[2].first + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*page*/ 2 && button0_disabled_value !== (button0_disabled_value = /*page*/ ctx[1] === 0)) {
    				prop_dev(button0, "disabled", button0_disabled_value);
    			}

    			if (dirty & /*labels*/ 4 && t2_value !== (t2_value = /*labels*/ ctx[2].previous + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*page*/ 2 && button1_disabled_value !== (button1_disabled_value = /*page*/ ctx[1] === 0)) {
    				prop_dev(button1, "disabled", button1_disabled_value);
    			}

    			if (dirty & /*page, buttons, onChange, pageCount*/ 27) {
    				each_value = /*buttons*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, t4);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*labels*/ 4 && t5_value !== (t5_value = /*labels*/ ctx[2].next + "")) set_data_dev(t5, t5_value);

    			if (dirty & /*page, pageCount*/ 10 && button2_disabled_value !== (button2_disabled_value = /*page*/ ctx[1] > /*pageCount*/ ctx[3] - 1)) {
    				prop_dev(button2, "disabled", button2_disabled_value);
    			}

    			if (dirty & /*labels*/ 4 && t7_value !== (t7_value = /*labels*/ ctx[2].last + "")) set_data_dev(t7, t7_value);

    			if (dirty & /*page, pageCount*/ 10 && button3_disabled_value !== (button3_disabled_value = /*page*/ ctx[1] >= /*pageCount*/ ctx[3])) {
    				prop_dev(button3, "disabled", button3_disabled_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
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

    let globalLabels$1;

    function setLabels(labels) {
    	globalLabels$1 = labels;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let pageCount;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Pagination', slots, []);
    	const dispatch = createEventDispatcher();
    	const stateContext = getContext("state");
    	let { buttons = [-2, -1, 0, 1, 2] } = $$props;
    	let { count } = $$props;
    	let { page = 0 } = $$props;
    	let { pageSize } = $$props;
    	let { serverSide = false } = $$props;

    	let { labels = {
    		first: "First",
    		last: "Last",
    		next: "Next",
    		previous: "Previous",
    		...globalLabels$1
    	} } = $$props;

    	function onChange(event, page) {
    		const state = stateContext.getState();

    		const detail = {
    			originalEvent: event,
    			page,
    			pageIndex: serverSide ? 0 : page * state.pageSize,
    			pageSize: state.pageSize
    		};

    		dispatch("pageChange", detail);

    		if (detail.preventDefault !== true) {
    			stateContext.setPage(detail.page, detail.pageIndex);
    		}
    	}

    	const writable_props = ['buttons', 'count', 'page', 'pageSize', 'serverSide', 'labels'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Pagination> was created with unknown prop '${key}'`);
    	});

    	const click_handler = e => onChange(e, 0);
    	const click_handler_1 = e => onChange(e, page - 1);
    	const click_handler_2 = (button, e) => onChange(e, page + button);
    	const click_handler_3 = e => onChange(e, page + 1);
    	const click_handler_4 = e => onChange(e, pageCount);

    	$$self.$$set = $$props => {
    		if ('buttons' in $$props) $$invalidate(0, buttons = $$props.buttons);
    		if ('count' in $$props) $$invalidate(5, count = $$props.count);
    		if ('page' in $$props) $$invalidate(1, page = $$props.page);
    		if ('pageSize' in $$props) $$invalidate(6, pageSize = $$props.pageSize);
    		if ('serverSide' in $$props) $$invalidate(7, serverSide = $$props.serverSide);
    		if ('labels' in $$props) $$invalidate(2, labels = $$props.labels);
    	};

    	$$self.$capture_state = () => ({
    		globalLabels: globalLabels$1,
    		setLabels,
    		createEventDispatcher,
    		getContext,
    		dispatch,
    		stateContext,
    		buttons,
    		count,
    		page,
    		pageSize,
    		serverSide,
    		labels,
    		onChange,
    		pageCount
    	});

    	$$self.$inject_state = $$props => {
    		if ('buttons' in $$props) $$invalidate(0, buttons = $$props.buttons);
    		if ('count' in $$props) $$invalidate(5, count = $$props.count);
    		if ('page' in $$props) $$invalidate(1, page = $$props.page);
    		if ('pageSize' in $$props) $$invalidate(6, pageSize = $$props.pageSize);
    		if ('serverSide' in $$props) $$invalidate(7, serverSide = $$props.serverSide);
    		if ('labels' in $$props) $$invalidate(2, labels = $$props.labels);
    		if ('pageCount' in $$props) $$invalidate(3, pageCount = $$props.pageCount);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*count, pageSize*/ 96) {
    			$$invalidate(3, pageCount = Math.floor(count / pageSize));
    		}
    	};

    	return [
    		buttons,
    		page,
    		labels,
    		pageCount,
    		onChange,
    		count,
    		pageSize,
    		serverSide,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4
    	];
    }

    class Pagination extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {
    			buttons: 0,
    			count: 5,
    			page: 1,
    			pageSize: 6,
    			serverSide: 7,
    			labels: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Pagination",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*count*/ ctx[5] === undefined && !('count' in props)) {
    			console.warn("<Pagination> was created without expected prop 'count'");
    		}

    		if (/*pageSize*/ ctx[6] === undefined && !('pageSize' in props)) {
    			console.warn("<Pagination> was created without expected prop 'pageSize'");
    		}
    	}

    	get buttons() {
    		throw new Error("<Pagination>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set buttons(value) {
    		throw new Error("<Pagination>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get count() {
    		throw new Error("<Pagination>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set count(value) {
    		throw new Error("<Pagination>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get page() {
    		throw new Error("<Pagination>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set page(value) {
    		throw new Error("<Pagination>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pageSize() {
    		throw new Error("<Pagination>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pageSize(value) {
    		throw new Error("<Pagination>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get serverSide() {
    		throw new Error("<Pagination>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set serverSide(value) {
    		throw new Error("<Pagination>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get labels() {
    		throw new Error("<Pagination>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labels(value) {
    		throw new Error("<Pagination>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/table/Table.svelte generated by Svelte v3.49.0 */
    const file$2 = "src/components/table/Table.svelte";
    const get_bottom_slot_changes = dirty => ({ rows: dirty & /*visibleRows*/ 128 });
    const get_bottom_slot_context = ctx => ({ rows: /*visibleRows*/ ctx[7] });
    const get_foot_slot_changes = dirty => ({ rows: dirty & /*visibleRows*/ 128 });
    const get_foot_slot_context = ctx => ({ rows: /*visibleRows*/ ctx[7] });
    const get_default_slot_changes = dirty => ({ rows: dirty & /*visibleRows*/ 128 });
    const get_default_slot_context = ctx => ({ rows: /*visibleRows*/ ctx[7] });
    const get_head_slot_changes = dirty => ({ rows: dirty & /*visibleRows*/ 128 });
    const get_head_slot_context = ctx => ({ rows: /*visibleRows*/ ctx[7] });
    const get_top_slot_changes = dirty => ({ rows: dirty & /*visibleRows*/ 128 });
    const get_top_slot_context = ctx => ({ rows: /*visibleRows*/ ctx[7] });

    // (151:19)      
    function fallback_block_1(ctx) {
    	let div;
    	let switch_instance;
    	let current;
    	var switch_value = Search;

    	function switch_props(ctx) {
    		return { $$inline: true };
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    		switch_instance.$on("search", /*onSearch*/ ctx[9]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			attr_dev(div, "class", "slot-top svelte-15rz99u");
    			add_location(div, file$2, 151, 4, 3428);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (switch_instance) {
    				mount_component(switch_instance, div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (switch_value !== (switch_value = Search)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					switch_instance.$on("search", /*onSearch*/ ctx[9]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, div, null);
    				} else {
    					switch_instance = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (switch_instance) destroy_component(switch_instance);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block_1.name,
    		type: "fallback",
    		source: "(151:19)      ",
    		ctx
    	});

    	return block;
    }

    // (179:4) {:else}
    function create_else_block$2(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[14].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[13], get_default_slot_context);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, visibleRows*/ 8320)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[13],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[13])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[13], dirty, get_default_slot_changes),
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
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(179:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (169:39) 
    function create_if_block_1$2(ctx) {
    	let tbody;
    	let tr;
    	let td;
    	let span;
    	let raw_value = /*labels*/ ctx[5].empty + "";

    	const block = {
    		c: function create() {
    			tbody = element("tbody");
    			tr = element("tr");
    			td = element("td");
    			span = element("span");
    			attr_dev(span, "class", "svelte-15rz99u");
    			add_location(span, file$2, 172, 12, 3958);
    			attr_dev(td, "class", "center svelte-15rz99u");
    			attr_dev(td, "colspan", "100%");
    			add_location(td, file$2, 171, 10, 3911);
    			add_location(tr, file$2, 170, 8, 3896);
    			add_location(tbody, file$2, 169, 6, 3880);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr);
    			append_dev(tr, td);
    			append_dev(td, span);
    			span.innerHTML = raw_value;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*labels*/ 32 && raw_value !== (raw_value = /*labels*/ ctx[5].empty + "")) span.innerHTML = raw_value;		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tbody);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(169:39) ",
    		ctx
    	});

    	return block;
    }

    // (159:4) {#if loading}
    function create_if_block$2(ctx) {
    	let tbody;
    	let tr;
    	let td;
    	let span;
    	let raw_value = /*labels*/ ctx[5].loading + "";

    	const block = {
    		c: function create() {
    			tbody = element("tbody");
    			tr = element("tr");
    			td = element("td");
    			span = element("span");
    			attr_dev(span, "class", "svelte-15rz99u");
    			add_location(span, file$2, 162, 12, 3725);
    			attr_dev(td, "class", "center svelte-15rz99u");
    			attr_dev(td, "colspan", "100%");
    			add_location(td, file$2, 161, 10, 3678);
    			add_location(tr, file$2, 160, 8, 3663);
    			add_location(tbody, file$2, 159, 6, 3647);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr);
    			append_dev(tr, td);
    			append_dev(td, span);
    			span.innerHTML = raw_value;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*labels*/ 32 && raw_value !== (raw_value = /*labels*/ ctx[5].loading + "")) span.innerHTML = raw_value;		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tbody);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(159:4) {#if loading}",
    		ctx
    	});

    	return block;
    }

    // (185:22)      
    function fallback_block(ctx) {
    	let div;
    	let switch_instance;
    	let current;
    	var switch_value = Pagination;

    	function switch_props(ctx) {
    		return {
    			props: {
    				page: /*page*/ ctx[0],
    				pageSize: /*pageSize*/ ctx[2],
    				serverSide: /*serverSide*/ ctx[4],
    				count: /*filteredRows*/ ctx[6].length - 1
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    		switch_instance.$on("pageChange", /*onPageChange*/ ctx[8]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			attr_dev(div, "class", "slot-bottom svelte-15rz99u");
    			add_location(div, file$2, 185, 4, 4187);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (switch_instance) {
    				mount_component(switch_instance, div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = {};
    			if (dirty & /*page*/ 1) switch_instance_changes.page = /*page*/ ctx[0];
    			if (dirty & /*pageSize*/ 4) switch_instance_changes.pageSize = /*pageSize*/ ctx[2];
    			if (dirty & /*serverSide*/ 16) switch_instance_changes.serverSide = /*serverSide*/ ctx[4];
    			if (dirty & /*filteredRows*/ 64) switch_instance_changes.count = /*filteredRows*/ ctx[6].length - 1;

    			if (switch_value !== (switch_value = Pagination)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					switch_instance.$on("pageChange", /*onPageChange*/ ctx[8]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, div, null);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (switch_instance) destroy_component(switch_instance);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(185:22)      ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let t0;
    	let table;
    	let t1;
    	let current_block_type_index;
    	let if_block;
    	let t2;
    	let table_class_value;
    	let t3;
    	let current;
    	const top_slot_template = /*#slots*/ ctx[14].top;
    	const top_slot = create_slot(top_slot_template, ctx, /*$$scope*/ ctx[13], get_top_slot_context);
    	const top_slot_or_fallback = top_slot || fallback_block_1(ctx);
    	const head_slot_template = /*#slots*/ ctx[14].head;
    	const head_slot = create_slot(head_slot_template, ctx, /*$$scope*/ ctx[13], get_head_slot_context);
    	const if_block_creators = [create_if_block$2, create_if_block_1$2, create_else_block$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*loading*/ ctx[1]) return 0;
    		if (/*visibleRows*/ ctx[7].length === 0) return 1;
    		return 2;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	const foot_slot_template = /*#slots*/ ctx[14].foot;
    	const foot_slot = create_slot(foot_slot_template, ctx, /*$$scope*/ ctx[13], get_foot_slot_context);
    	const bottom_slot_template = /*#slots*/ ctx[14].bottom;
    	const bottom_slot = create_slot(bottom_slot_template, ctx, /*$$scope*/ ctx[13], get_bottom_slot_context);
    	const bottom_slot_or_fallback = bottom_slot || fallback_block(ctx);

    	const block = {
    		c: function create() {
    			if (top_slot_or_fallback) top_slot_or_fallback.c();
    			t0 = space();
    			table = element("table");
    			if (head_slot) head_slot.c();
    			t1 = space();
    			if_block.c();
    			t2 = space();
    			if (foot_slot) foot_slot.c();
    			t3 = space();
    			if (bottom_slot_or_fallback) bottom_slot_or_fallback.c();
    			attr_dev(table, "class", table_class_value = "" + (null_to_empty('table ' + /*$$props*/ ctx[10].class) + " svelte-15rz99u"));
    			toggle_class(table, "responsive", /*responsive*/ ctx[3]);
    			add_location(table, file$2, 156, 2, 3539);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (top_slot_or_fallback) {
    				top_slot_or_fallback.m(target, anchor);
    			}

    			insert_dev(target, t0, anchor);
    			insert_dev(target, table, anchor);

    			if (head_slot) {
    				head_slot.m(table, null);
    			}

    			append_dev(table, t1);
    			if_blocks[current_block_type_index].m(table, null);
    			append_dev(table, t2);

    			if (foot_slot) {
    				foot_slot.m(table, null);
    			}

    			insert_dev(target, t3, anchor);

    			if (bottom_slot_or_fallback) {
    				bottom_slot_or_fallback.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (top_slot) {
    				if (top_slot.p && (!current || dirty & /*$$scope, visibleRows*/ 8320)) {
    					update_slot_base(
    						top_slot,
    						top_slot_template,
    						ctx,
    						/*$$scope*/ ctx[13],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[13])
    						: get_slot_changes(top_slot_template, /*$$scope*/ ctx[13], dirty, get_top_slot_changes),
    						get_top_slot_context
    					);
    				}
    			}

    			if (head_slot) {
    				if (head_slot.p && (!current || dirty & /*$$scope, visibleRows*/ 8320)) {
    					update_slot_base(
    						head_slot,
    						head_slot_template,
    						ctx,
    						/*$$scope*/ ctx[13],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[13])
    						: get_slot_changes(head_slot_template, /*$$scope*/ ctx[13], dirty, get_head_slot_changes),
    						get_head_slot_context
    					);
    				}
    			}

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
    				if_block.m(table, t2);
    			}

    			if (foot_slot) {
    				if (foot_slot.p && (!current || dirty & /*$$scope, visibleRows*/ 8320)) {
    					update_slot_base(
    						foot_slot,
    						foot_slot_template,
    						ctx,
    						/*$$scope*/ ctx[13],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[13])
    						: get_slot_changes(foot_slot_template, /*$$scope*/ ctx[13], dirty, get_foot_slot_changes),
    						get_foot_slot_context
    					);
    				}
    			}

    			if (!current || dirty & /*$$props*/ 1024 && table_class_value !== (table_class_value = "" + (null_to_empty('table ' + /*$$props*/ ctx[10].class) + " svelte-15rz99u"))) {
    				attr_dev(table, "class", table_class_value);
    			}

    			if (dirty & /*$$props, responsive*/ 1032) {
    				toggle_class(table, "responsive", /*responsive*/ ctx[3]);
    			}

    			if (bottom_slot) {
    				if (bottom_slot.p && (!current || dirty & /*$$scope, visibleRows*/ 8320)) {
    					update_slot_base(
    						bottom_slot,
    						bottom_slot_template,
    						ctx,
    						/*$$scope*/ ctx[13],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[13])
    						: get_slot_changes(bottom_slot_template, /*$$scope*/ ctx[13], dirty, get_bottom_slot_changes),
    						get_bottom_slot_context
    					);
    				}
    			} else {
    				if (bottom_slot_or_fallback && bottom_slot_or_fallback.p && (!current || dirty & /*page, pageSize, serverSide, filteredRows*/ 85)) {
    					bottom_slot_or_fallback.p(ctx, !current ? -1 : dirty);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(top_slot_or_fallback, local);
    			transition_in(head_slot, local);
    			transition_in(if_block);
    			transition_in(foot_slot, local);
    			transition_in(bottom_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(top_slot_or_fallback, local);
    			transition_out(head_slot, local);
    			transition_out(if_block);
    			transition_out(foot_slot, local);
    			transition_out(bottom_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (top_slot_or_fallback) top_slot_or_fallback.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(table);
    			if (head_slot) head_slot.d(detaching);
    			if_blocks[current_block_type_index].d();
    			if (foot_slot) foot_slot.d(detaching);
    			if (detaching) detach_dev(t3);
    			if (bottom_slot_or_fallback) bottom_slot_or_fallback.d(detaching);
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

    let globalLabels;

    function setTableLabels(labels) {
    	globalLabels = labels;
    }

    const setPaginationLabels = setLabels;
    const setSearchLabels = setLabels$1;
    const setSortLabels = setLabels$2;

    function instance$3($$self, $$props, $$invalidate) {
    	let filteredRows;
    	let visibleRows;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Table', slots, ['top','head','default','foot','bottom']);
    	const dispatch = createEventDispatcher();
    	let { loading = false } = $$props;
    	let { page = 0 } = $$props;
    	let { pageIndex = 0 } = $$props;
    	let { pageSize = 10 } = $$props;
    	let { responsive = true } = $$props;
    	let { rows } = $$props;
    	let { serverSide = false } = $$props;

    	let { labels = {
    		empty: "No records available",
    		loading: "Loading data",
    		...globalLabels
    	} } = $$props;

    	let buttons = [-2, -1, 0, 1, 2];
    	let pageCount = 0;

    	setContext("state", {
    		getState: () => ({
    			page,
    			pageIndex,
    			pageSize,
    			rows,
    			filteredRows
    		}),
    		setPage: (_page, _pageIndex) => {
    			$$invalidate(0, page = _page);
    			$$invalidate(11, pageIndex = _pageIndex);
    		},
    		setRows: _rows => $$invalidate(6, filteredRows = _rows)
    	});

    	function onPageChange(event) {
    		dispatch("pageChange", event.detail);
    	}

    	function onSearch(event) {
    		dispatch("search", event.detail);
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(10, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ('loading' in $$new_props) $$invalidate(1, loading = $$new_props.loading);
    		if ('page' in $$new_props) $$invalidate(0, page = $$new_props.page);
    		if ('pageIndex' in $$new_props) $$invalidate(11, pageIndex = $$new_props.pageIndex);
    		if ('pageSize' in $$new_props) $$invalidate(2, pageSize = $$new_props.pageSize);
    		if ('responsive' in $$new_props) $$invalidate(3, responsive = $$new_props.responsive);
    		if ('rows' in $$new_props) $$invalidate(12, rows = $$new_props.rows);
    		if ('serverSide' in $$new_props) $$invalidate(4, serverSide = $$new_props.serverSide);
    		if ('labels' in $$new_props) $$invalidate(5, labels = $$new_props.labels);
    		if ('$$scope' in $$new_props) $$invalidate(13, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		Pagination,
    		_setPaginationLabels: setLabels,
    		Row,
    		Search,
    		_setSearchLabels: setLabels$1,
    		Sort,
    		_setSortLabels: setLabels$2,
    		globalLabels,
    		setTableLabels,
    		setPaginationLabels,
    		setSearchLabels,
    		setSortLabels,
    		createEventDispatcher,
    		setContext,
    		dispatch,
    		loading,
    		page,
    		pageIndex,
    		pageSize,
    		responsive,
    		rows,
    		serverSide,
    		labels,
    		buttons,
    		pageCount,
    		onPageChange,
    		onSearch,
    		filteredRows,
    		visibleRows
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(10, $$props = assign(assign({}, $$props), $$new_props));
    		if ('loading' in $$props) $$invalidate(1, loading = $$new_props.loading);
    		if ('page' in $$props) $$invalidate(0, page = $$new_props.page);
    		if ('pageIndex' in $$props) $$invalidate(11, pageIndex = $$new_props.pageIndex);
    		if ('pageSize' in $$props) $$invalidate(2, pageSize = $$new_props.pageSize);
    		if ('responsive' in $$props) $$invalidate(3, responsive = $$new_props.responsive);
    		if ('rows' in $$props) $$invalidate(12, rows = $$new_props.rows);
    		if ('serverSide' in $$props) $$invalidate(4, serverSide = $$new_props.serverSide);
    		if ('labels' in $$props) $$invalidate(5, labels = $$new_props.labels);
    		if ('buttons' in $$props) buttons = $$new_props.buttons;
    		if ('pageCount' in $$props) pageCount = $$new_props.pageCount;
    		if ('filteredRows' in $$props) $$invalidate(6, filteredRows = $$new_props.filteredRows);
    		if ('visibleRows' in $$props) $$invalidate(7, visibleRows = $$new_props.visibleRows);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*rows*/ 4096) {
    			$$invalidate(6, filteredRows = rows);
    		}

    		if ($$self.$$.dirty & /*filteredRows, pageIndex, pageSize*/ 2116) {
    			$$invalidate(7, visibleRows = filteredRows.slice(pageIndex, pageIndex + pageSize));
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		page,
    		loading,
    		pageSize,
    		responsive,
    		serverSide,
    		labels,
    		filteredRows,
    		visibleRows,
    		onPageChange,
    		onSearch,
    		$$props,
    		pageIndex,
    		rows,
    		$$scope,
    		slots
    	];
    }

    class Table extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {
    			loading: 1,
    			page: 0,
    			pageIndex: 11,
    			pageSize: 2,
    			responsive: 3,
    			rows: 12,
    			serverSide: 4,
    			labels: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Table",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*rows*/ ctx[12] === undefined && !('rows' in props)) {
    			console.warn("<Table> was created without expected prop 'rows'");
    		}
    	}

    	get loading() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set loading(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get page() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set page(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pageIndex() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pageIndex(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pageSize() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pageSize(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get responsive() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set responsive(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rows() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rows(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get serverSide() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set serverSide(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get labels() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labels(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function sortString(rows, dir, key) {
        return rows.sort((a, b) =>
          dir === "asc"
            ? ("" + a[key]).localeCompare(b[key])
            : ("" + b[key]).localeCompare(a[key])
        );
      }
      
    function sortNumber(rows, dir, key) {
        return rows.sort((a, b) =>
            dir === "asc" ? a[key] - b[key] : b[key] - a[key]
    );
    }

    /* src/components/table/TableWrapper.svelte generated by Svelte v3.49.0 */

    const { Object: Object_1, console: console_1 } = globals;
    const file$1 = "src/components/table/TableWrapper.svelte";

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[12] = list[i];
    	child_ctx[14] = i;
    	return child_ctx;
    }

    function get_each_context_2$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i][0];
    	child_ctx[7] = list[i][1];

    	const constants_0 = Number.isFinite(/*v*/ child_ctx[7])
    	? 'number'
    	: 'string';

    	child_ctx[8] = constants_0;

    	const constants_1 = /*type*/ child_ctx[8] === 'number'
    	? formatThousandsComma
    	: d => d;

    	child_ctx[15] = constants_1;
    	return child_ctx;
    }

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i][0];
    	child_ctx[7] = list[i][1];

    	const constants_0 = Number.isFinite(/*v*/ child_ctx[7])
    	? 'number'
    	: 'string';

    	child_ctx[8] = constants_0;

    	const constants_1 = /*type*/ child_ctx[8] === 'number'
    	? /*onSortNumber*/ child_ctx[4]
    	: /*onSortString*/ child_ctx[3];

    	child_ctx[9] = constants_1;
    	return child_ctx;
    }

    // (70:10) {:else}
    function create_else_block$1(ctx) {
    	let td;
    	let t_value = /*formatter*/ ctx[15](/*row*/ ctx[12][/*k*/ ctx[6]]) + "";
    	let t;
    	let td_class_value;
    	let td_data_label_value;

    	const block = {
    		c: function create() {
    			td = element("td");
    			t = text$1(t_value);
    			attr_dev(td, "class", td_class_value = "" + (null_to_empty(`row-cell row-cell-${/*type*/ ctx[8]} row-cell-${/*k*/ ctx[6]}`) + " svelte-1k3dzdv"));
    			attr_dev(td, "data-label", td_data_label_value = channelMap.get(/*k*/ ctx[6]));
    			add_location(td, file$1, 69, 18, 2124);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			append_dev(td, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*data, rows2*/ 33 && t_value !== (t_value = /*formatter*/ ctx[15](/*row*/ ctx[12][/*k*/ ctx[6]]) + "")) set_data_dev(t, t_value);

    			if (dirty & /*data*/ 1 && td_class_value !== (td_class_value = "" + (null_to_empty(`row-cell row-cell-${/*type*/ ctx[8]} row-cell-${/*k*/ ctx[6]}`) + " svelte-1k3dzdv"))) {
    				attr_dev(td, "class", td_class_value);
    			}

    			if (dirty & /*data*/ 1 && td_data_label_value !== (td_data_label_value = channelMap.get(/*k*/ ctx[6]))) {
    				attr_dev(td, "data-label", td_data_label_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(70:10) {:else}",
    		ctx
    	});

    	return block;
    }

    // (63:8) {#if k === 'cluster'}
    function create_if_block_1$1(ctx) {
    	let td;
    	let span;
    	let t_value = /*formatter*/ ctx[15](/*row*/ ctx[12][/*k*/ ctx[6]]) + "";
    	let t;
    	let td_class_value;
    	let td_data_label_value;

    	const block = {
    		c: function create() {
    			td = element("td");
    			span = element("span");
    			t = text$1(t_value);
    			attr_dev(span, "class", "cluster svelte-1k3dzdv");
    			set_style(span, "--color", colorMap.get(/*row*/ ctx[12][/*k*/ ctx[6]]));
    			add_location(span, file$1, 67, 12, 1994);
    			attr_dev(td, "class", td_class_value = "" + (null_to_empty(`row-cell row-cell-${/*type*/ ctx[8]} row-cell-${/*k*/ ctx[6]}`) + " svelte-1k3dzdv"));
    			attr_dev(td, "data-label", td_data_label_value = channelMap.get(/*k*/ ctx[6]));
    			add_location(td, file$1, 63, 10, 1855);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			append_dev(td, span);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*data, rows2*/ 33 && t_value !== (t_value = /*formatter*/ ctx[15](/*row*/ ctx[12][/*k*/ ctx[6]]) + "")) set_data_dev(t, t_value);

    			if (dirty & /*rows2, data*/ 33) {
    				set_style(span, "--color", colorMap.get(/*row*/ ctx[12][/*k*/ ctx[6]]));
    			}

    			if (dirty & /*data*/ 1 && td_class_value !== (td_class_value = "" + (null_to_empty(`row-cell row-cell-${/*type*/ ctx[8]} row-cell-${/*k*/ ctx[6]}`) + " svelte-1k3dzdv"))) {
    				attr_dev(td, "class", td_class_value);
    			}

    			if (dirty & /*data*/ 1 && td_data_label_value !== (td_data_label_value = channelMap.get(/*k*/ ctx[6]))) {
    				attr_dev(td, "data-label", td_data_label_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(63:8) {#if k === 'cluster'}",
    		ctx
    	});

    	return block;
    }

    // (60:6) {#each Object.entries(data[0]) as [k, v]}
    function create_each_block_2$1(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*k*/ ctx[6] === 'cluster') return create_if_block_1$1;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

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
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

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
    		id: create_each_block_2$1.name,
    		type: "each",
    		source: "(60:6) {#each Object.entries(data[0]) as [k, v]}",
    		ctx
    	});

    	return block;
    }

    // (59:6) <Row {index}>
    function create_default_slot_1(ctx) {
    	let t;
    	let each_value_2 = Object.entries(/*data*/ ctx[0][0]);
    	validate_each_argument(each_value_2);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2$1(get_each_context_2$1(ctx, each_value_2, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*Number, Object, data, channelLabelMap, clusterColorMap, rows2, formatThousandsComma*/ 33) {
    				each_value_2 = Object.entries(/*data*/ ctx[0][0]);
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2$1(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_2$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(t.parentNode, t);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_2.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(59:6) <Row {index}>",
    		ctx
    	});

    	return block;
    }

    // (57:4) {#each rows2 as row, index (row)}
    function create_each_block_1$1(key_1, ctx) {
    	let first;
    	let row;
    	let current;

    	row = new Row({
    			props: {
    				index: /*index*/ ctx[14],
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			create_component(row.$$.fragment);
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			mount_component(row, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const row_changes = {};
    			if (dirty & /*rows2*/ 32) row_changes.index = /*index*/ ctx[14];

    			if (dirty & /*$$scope, data, rows2*/ 262177) {
    				row_changes.$$scope = { dirty, ctx };
    			}

    			row.$set(row_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(row.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(row.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			destroy_component(row, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(57:4) {#each rows2 as row, index (row)}",
    		ctx
    	});

    	return block;
    }

    // (37:0) <Table    { page }    { pageSize }    rows={ data }    let:rows={ rows2 } >
    function create_default_slot(ctx) {
    	let tbody;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let current;
    	let each_value_1 = /*rows2*/ ctx[5];
    	validate_each_argument(each_value_1);
    	const get_key = ctx => /*row*/ ctx[12];
    	validate_each_keys(ctx, each_value_1, get_each_context_1$1, get_key);

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		let child_ctx = get_each_context_1$1(ctx, each_value_1, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block_1$1(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(tbody, file$1, 55, 2, 1491);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tbody, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*rows2, Object, data, Number, channelLabelMap, clusterColorMap, formatThousandsComma*/ 33) {
    				each_value_1 = /*rows2*/ ctx[5];
    				validate_each_argument(each_value_1);
    				group_outros();
    				validate_each_keys(ctx, each_value_1, get_each_context_1$1, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value_1, each_1_lookup, tbody, outro_and_destroy_block, create_each_block_1$1, null, get_each_context_1$1);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tbody);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(37:0) <Table    { page }    { pageSize }    rows={ data }    let:rows={ rows2 } >",
    		ctx
    	});

    	return block;
    }

    // (45:6) {#if data.length}
    function create_if_block$1(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = Object.entries(/*data*/ ctx[0][0]);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

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
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*Number, Object, data, onSortNumber, onSortString, channelLabelMap*/ 25) {
    				each_value = Object.entries(/*data*/ ctx[0][0]);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(45:6) {#if data.length}",
    		ctx
    	});

    	return block;
    }

    // (46:8) {#each Object.entries(data[0]) as [k, v]}
    function create_each_block$1(ctx) {
    	let th;
    	let div;
    	let t0_value = channelMap.get(/*k*/ ctx[6]) + "";
    	let t0;
    	let t1;
    	let sort;
    	let t2;
    	let th_class_value;
    	let current;

    	sort = new Sort({
    			props: { key: /*k*/ ctx[6] },
    			$$inline: true
    		});

    	sort.$on("sort", function () {
    		if (is_function(/*sorter*/ ctx[9])) /*sorter*/ ctx[9].apply(this, arguments);
    	});

    	const block = {
    		c: function create() {
    			th = element("th");
    			div = element("div");
    			t0 = text$1(t0_value);
    			t1 = space();
    			create_component(sort.$$.fragment);
    			t2 = space();
    			attr_dev(div, "class", "content svelte-1k3dzdv");
    			add_location(div, file$1, 49, 12, 1338);
    			attr_dev(th, "class", th_class_value = "" + (null_to_empty(`header-cell header-cell-${/*type*/ ctx[8]} header-cell-${/*k*/ ctx[6]}`) + " svelte-1k3dzdv"));
    			add_location(th, file$1, 48, 10, 1262);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, th, anchor);
    			append_dev(th, div);
    			append_dev(div, t0);
    			append_dev(div, t1);
    			mount_component(sort, div, null);
    			append_dev(th, t2);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if ((!current || dirty & /*data*/ 1) && t0_value !== (t0_value = channelMap.get(/*k*/ ctx[6]) + "")) set_data_dev(t0, t0_value);
    			const sort_changes = {};
    			if (dirty & /*data*/ 1) sort_changes.key = /*k*/ ctx[6];
    			sort.$set(sort_changes);

    			if (!current || dirty & /*data*/ 1 && th_class_value !== (th_class_value = "" + (null_to_empty(`header-cell header-cell-${/*type*/ ctx[8]} header-cell-${/*k*/ ctx[6]}`) + " svelte-1k3dzdv"))) {
    				attr_dev(th, "class", th_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sort.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sort.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(th);
    			destroy_component(sort);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(46:8) {#each Object.entries(data[0]) as [k, v]}",
    		ctx
    	});

    	return block;
    }

    // (43:2) 
    function create_head_slot(ctx) {
    	let thead;
    	let tr;
    	let current;
    	let if_block = /*data*/ ctx[0].length && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr = element("tr");
    			if (if_block) if_block.c();
    			add_location(tr, file$1, 43, 4, 1030);
    			attr_dev(thead, "slot", "head");
    			add_location(thead, file$1, 42, 2, 1006);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr);
    			if (if_block) if_block.m(tr, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*data*/ ctx[0].length) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*data*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(tr, null);
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
    			if (detaching) detach_dev(thead);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_head_slot.name,
    		type: "slot",
    		source: "(43:2) ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let table;
    	let current;

    	table = new Table({
    			props: {
    				page: /*page*/ ctx[2],
    				pageSize: /*pageSize*/ ctx[1],
    				rows: /*data*/ ctx[0],
    				$$slots: {
    					head: [
    						create_head_slot,
    						({ rows: rows2 }) => ({ 5: rows2 }),
    						({ rows: rows2 }) => rows2 ? 32 : 0
    					],
    					default: [
    						create_default_slot,
    						({ rows: rows2 }) => ({ 5: rows2 }),
    						({ rows: rows2 }) => rows2 ? 32 : 0
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(table.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(table, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const table_changes = {};
    			if (dirty & /*pageSize*/ 2) table_changes.pageSize = /*pageSize*/ ctx[1];
    			if (dirty & /*data*/ 1) table_changes.rows = /*data*/ ctx[0];

    			if (dirty & /*$$scope, data, rows2*/ 262177) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(table.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(table.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(table, detaching);
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

    function onCellClick(row) {
    	console.log(row);
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TableWrapper', slots, []);
    	let { data = [] } = $$props;
    	let page = 0; //first page
    	let { pageSize = 10 } = $$props;

    	function onSortString(event) {
    		event.detail.rows = sortString(event.detail.rows, event.detail.dir, event.detail.key);
    	}

    	function onSortNumber(event) {
    		event.detail.rows = sortNumber(event.detail.rows, event.detail.dir, event.detail.key);
    	}

    	const writable_props = ['data', 'pageSize'];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<TableWrapper> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('data' in $$props) $$invalidate(0, data = $$props.data);
    		if ('pageSize' in $$props) $$invalidate(1, pageSize = $$props.pageSize);
    	};

    	$$self.$capture_state = () => ({
    		Table,
    		Pagination,
    		Row,
    		Search,
    		Sort,
    		sortNumber,
    		sortString,
    		channelLabelMap: channelMap,
    		clusterColorMap: colorMap,
    		formatThousandsComma,
    		data,
    		page,
    		pageSize,
    		onCellClick,
    		onSortString,
    		onSortNumber
    	});

    	$$self.$inject_state = $$props => {
    		if ('data' in $$props) $$invalidate(0, data = $$props.data);
    		if ('page' in $$props) $$invalidate(2, page = $$props.page);
    		if ('pageSize' in $$props) $$invalidate(1, pageSize = $$props.pageSize);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [data, pageSize, page, onSortString, onSortNumber];
    }

    class TableWrapper extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { data: 0, pageSize: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TableWrapper",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get data() {
    		throw new Error("<TableWrapper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<TableWrapper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pageSize() {
    		throw new Error("<TableWrapper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pageSize(value) {
    		throw new Error("<TableWrapper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/main/Supplementary.svelte generated by Svelte v3.49.0 */
    const file = "src/components/main/Supplementary.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	child_ctx[11] = i;
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	child_ctx[11] = i;
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	child_ctx[11] = i;
    	return child_ctx;
    }

    function get_each_context_3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	child_ctx[11] = i;
    	return child_ctx;
    }

    // (41:8) {:else}
    function create_else_block(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "chart-placeholder svelte-1xnka0e");
    			add_location(div, file, 40, 16, 1486);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(41:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (29:8) {#if loaded}
    function create_if_block_1(ctx) {
    	let singlelinechart;
    	let current;

    	singlelinechart = new SingleLineChart({
    			props: {
    				data: /*data_videos*/ ctx[2],
    				url: /*videos_url*/ ctx[4],
    				xKey: /*xKey*/ ctx[5],
    				yKey: /*yKey*/ ctx[6],
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
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(29:8) {#if loaded}",
    		ctx
    	});

    	return block;
    }

    // (44:12) {#each copy['section-two']['copy'] as d, i}
    function create_each_block_3(ctx) {
    	let p;
    	let t_value = /*d*/ ctx[9].value + "";
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text$1(t_value);
    			attr_dev(p, "class", "svelte-1xnka0e");
    			add_location(p, file, 44, 16, 1648);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_3.name,
    		type: "each",
    		source: "(44:12) {#each copy['section-two']['copy'] as d, i}",
    		ctx
    	});

    	return block;
    }

    // (49:12) {#each copy['section-two']['copy'] as d, i}
    function create_each_block_2(ctx) {
    	let p;
    	let t0_value = /*d*/ ctx[9].value + "";
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text$1(t0_value);
    			t1 = space();
    			attr_dev(p, "class", "svelte-1xnka0e");
    			add_location(p, file, 49, 16, 1795);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(49:12) {#each copy['section-two']['copy'] as d, i}",
    		ctx
    	});

    	return block;
    }

    // (55:8) {#if loaded}
    function create_if_block(ctx) {
    	let div;
    	let tablewrapper;
    	let current;

    	tablewrapper = new TableWrapper({
    			props: {
    				data: /*data_channels*/ ctx[3],
    				pageSize: 20
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(tablewrapper.$$.fragment);
    			attr_dev(div, "class", "table-wrapper svelte-1xnka0e");
    			add_location(div, file, 55, 12, 1918);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(tablewrapper, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const tablewrapper_changes = {};
    			if (dirty & /*data_channels*/ 8) tablewrapper_changes.data = /*data_channels*/ ctx[3];
    			tablewrapper.$set(tablewrapper_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tablewrapper.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tablewrapper.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(tablewrapper);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(55:8) {#if loaded}",
    		ctx
    	});

    	return block;
    }

    // (61:12) {#each copy['section-two']['copy'] as d, i}
    function create_each_block_1(ctx) {
    	let p;
    	let t0_value = /*d*/ ctx[9].value + "";
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text$1(t0_value);
    			t1 = space();
    			attr_dev(p, "class", "svelte-1xnka0e");
    			add_location(p, file, 61, 16, 2157);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(61:12) {#each copy['section-two']['copy'] as d, i}",
    		ctx
    	});

    	return block;
    }

    // (68:12) {#each copy['section-two']['references'] as d, i}
    function create_each_block(ctx) {
    	let p;
    	let t0_value = /*d*/ ctx[9].value + "";
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text$1(t0_value);
    			t1 = space();
    			add_location(p, file, 68, 16, 2358);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(68:12) {#each copy['section-two']['references'] as d, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let main;
    	let div3;
    	let h2;
    	let t1;
    	let current_block_type_index;
    	let if_block0;
    	let t2;
    	let div0;
    	let t3;
    	let t4;
    	let t5;
    	let div1;
    	let t6;
    	let div2;
    	let inView_action;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block_1, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*loaded*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
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

    	let if_block1 = /*loaded*/ ctx[1] && create_if_block(ctx);
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
    			div3 = element("div");
    			h2 = element("h2");
    			h2.textContent = "Supplementary information appendix";
    			t1 = space();
    			if_block0.c();
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
    			if (if_block1) if_block1.c();
    			t5 = space();
    			div1 = element("div");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t6 = space();
    			div2 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(h2, "class", "section-title svelte-1xnka0e");
    			add_location(h2, file, 27, 8, 996);
    			attr_dev(div0, "class", "copy copy-part1 svelte-1xnka0e");
    			add_location(div0, file, 42, 8, 1546);
    			attr_dev(div1, "class", "copy copy-part2 svelte-1xnka0e");
    			add_location(div1, file, 59, 8, 2055);
    			attr_dev(div2, "class", "references svelte-1xnka0e");
    			add_location(div2, file, 66, 8, 2255);
    			attr_dev(div3, "class", "section section-supplementary svelte-1xnka0e");
    			add_location(div3, file, 26, 4, 890);
    			attr_dev(main, "class", "supplementary svelte-1xnka0e");
    			add_location(main, file, 25, 0, 857);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div3);
    			append_dev(div3, h2);
    			append_dev(div3, t1);
    			if_blocks[current_block_type_index].m(div3, null);
    			append_dev(div3, t2);
    			append_dev(div3, div0);

    			for (let i = 0; i < each_blocks_3.length; i += 1) {
    				each_blocks_3[i].m(div0, null);
    			}

    			append_dev(div0, t3);

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].m(div0, null);
    			}

    			append_dev(div3, t4);
    			if (if_block1) if_block1.m(div3, null);
    			append_dev(div3, t5);
    			append_dev(div3, div1);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div1, null);
    			}

    			append_dev(div3, t6);
    			append_dev(div3, div2);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div2, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(inView_action = inView.call(null, div3, { once: /*once*/ ctx[0] })),
    					listen_dev(div3, "enter", /*enter_handler*/ ctx[7], false, false, false)
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
    				if_block0.m(div3, t2);
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
    						each_blocks_2[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks_2.length; i += 1) {
    					each_blocks_2[i].d(1);
    				}

    				each_blocks_2.length = each_value_2.length;
    			}

    			if (/*loaded*/ ctx[1]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*loaded*/ 2) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div3, t5);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
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
    						each_blocks_1[i].m(div1, null);
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
    						each_blocks[i].m(div2, null);
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
    			if (detaching) detach_dev(main);
    			if_blocks[current_block_type_index].d();
    			destroy_each(each_blocks_3, detaching);
    			destroy_each(each_blocks_2, detaching);
    			if (if_block1) if_block1.d();
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
    	let channels_url = 'assets/data/channels_top250.csv';
    	let data_channels;
    	let xKey = 'date';
    	let yKey = 'count';

    	onMount(async () => {
    		const res_videos = await csv(videos_url, autoType);
    		$$invalidate(2, data_videos = res_videos);
    		const res_channels = await csv(channels_url, autoType);
    		$$invalidate(3, data_channels = res_channels);
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
    		TableWrapper,
    		formatThousands,
    		copy: data,
    		loaded,
    		once,
    		videos_url,
    		data_videos,
    		channels_url,
    		data_channels,
    		xKey,
    		yKey
    	});

    	$$self.$inject_state = $$props => {
    		if ('loaded' in $$props) $$invalidate(1, loaded = $$props.loaded);
    		if ('once' in $$props) $$invalidate(0, once = $$props.once);
    		if ('videos_url' in $$props) $$invalidate(4, videos_url = $$props.videos_url);
    		if ('data_videos' in $$props) $$invalidate(2, data_videos = $$props.data_videos);
    		if ('channels_url' in $$props) channels_url = $$props.channels_url;
    		if ('data_channels' in $$props) $$invalidate(3, data_channels = $$props.data_channels);
    		if ('xKey' in $$props) $$invalidate(5, xKey = $$props.xKey);
    		if ('yKey' in $$props) $$invalidate(6, yKey = $$props.yKey);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		once,
    		loaded,
    		data_videos,
    		data_channels,
    		videos_url,
    		xKey,
    		yKey,
    		enter_handler
    	];
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
    	let supplementary;
    	let t1;
    	let footer;
    	let current;
    	header = new Header({ $$inline: true });
    	supplementary = new Supplementary({ props: { once: true }, $$inline: true });
    	footer = new Footer({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(header.$$.fragment);
    			t0 = space();
    			create_component(supplementary.$$.fragment);
    			t1 = space();
    			create_component(footer.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(header, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(supplementary, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(footer, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			transition_in(supplementary.$$.fragment, local);
    			transition_in(footer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			transition_out(supplementary.$$.fragment, local);
    			transition_out(footer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(header, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(supplementary, detaching);
    			if (detaching) detach_dev(t1);
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
