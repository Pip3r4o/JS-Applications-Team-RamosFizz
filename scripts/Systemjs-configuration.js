/**
 * Created by Antoan on 8/30/2015.
 */
System.config({
    transpiler:'babel',
    map:{
        babel:'node_modules/babel-core/browser.js'
    }
});

System.import('scripts/index.js');
