var app = app || {};
var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var group;
// var material, geometry, mesh;
var start = Date.now();
window.onload = function() {

    if (!Detector.webgl) Detector.addGetWebGLMessage();
    var container, stats;
    var camera, scene, renderer;
    var uniforms;

    init();
    animate();

    function init() {

        container = document.getElementById('container');

        camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 3000 );
        camera.position.set( 0, 100, 700 );

        scene = new THREE.Scene();

        uniforms = {
            time: {value: 1.0},
            resolution: {value: new THREE.Vector2()}
        };

        // group = new THREE.Group();
        var material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: document.getElementById('vertexShader').textContent,
            fragmentShader: document.getElementById('fragmentShader').textContent
        });
        // for ( var i = 0; i < 40; i ++ ) {
        //     var geometry = new THREE.TorusBufferGeometry(i * 5, 2, 16, 100);
        //     var mesh = new THREE.Mesh(geometry, material);
        //     mesh.position.set(0,0,0);
        //     mesh.matrixWorldNeedsUpdate = true;
        //     mesh.updateMatrix();
        //     group.add(mesh);
        // }
        //
        // scene.add( group );

        var geometry = new THREE.PlaneBufferGeometry(window.innerWidth,window.innerHeight);
        var mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        controls = new THREE.OrbitControls( camera, renderer.domElement );
        container.appendChild(renderer.domElement);

        // stats = new Stats();
        // container.appendChild(stats.dom);

        onWindowResize();
        document.addEventListener('mousemove', onMouseMove, false);
        window.addEventListener('resize', onWindowResize, false);
        document.addEventListener('keydown', onKeyDown, false);

    }

    function onMouseMove(event) {
        mouseX = (event.clientX - windowHalfX ) * 10;
        mouseY = (event.clientY - windowHalfY ) * 10;
    }

    function onWindowResize(event) {

        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;

        renderer.setSize(window.innerWidth, window.innerHeight);

        uniforms.resolution.value.x = window.innerWidth;
        uniforms.resolution.value.y = window.innerHeight;

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    }


    function animate() {
        requestAnimationFrame(animate);

        render();
        // stats.update();

    }

    function render() {
        var timeFloatData = [];
        var timer = Date.now() - start;
        if(app.audio || app.microphone) {
            timeFloatData = new Float32Array(analyser.fftSize);
            analyser.getFloatTimeDomainData(timeFloatData);

            for (var j = 0; j < timeFloatData.length; j++) {
                uniforms.time.value += timeFloatData[j]/5;
            }
            // for (var k = 0; k < group.children.length; k++){
            //     var ring = group.children[k];
            //     ring.position.z = (Math.abs( Math.cos( timer * timeFloatData[k+100] ) ) * 100);
            // }
        }
        // if(!app.audio && !app.microphone){
        //     uniforms.time.value += 0.05;
        // }
        // camera.position.z = 50 + (Math.abs( Math.cos( timer * 0.0008 ) ) * 150);

        renderer.render(scene, camera);

    }
};

function onKeyDown(e) {
    switch (e.which) {
        case 32:
            // audio play
            if (app.play && app.audio) {
                app.audio.pause();
                app.play = false;
            }
            else {
                app.audio.play();
                app.play = true;
            }

    }
}
