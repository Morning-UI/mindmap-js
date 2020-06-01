import Vue                                      from 'vue';

export interface InstallOptions {
    tag?: string;
}

export interface InstallFn {
    (Vue: Vue.VueConstructor, options: InstallOptions): void;
}

export interface Mindmap {
    install: InstallFn;
}
