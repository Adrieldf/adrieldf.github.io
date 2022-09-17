import 'dart:async';

import 'dart:ui' as ui;

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

import 'package:flutter_gl/flutter_gl.dart';

import 'package:three_dart/three_dart.dart' as THREE;

class WebGLBackground extends StatefulWidget {
  const WebGLBackground({Key? key}) : super(key: key);

  @override
  State<WebGLBackground> createState() => _WebGLBackgroundState();
}

class _WebGLBackgroundState extends State<WebGLBackground> {
  late FlutterGlPlugin three3dRender;
  THREE.WebGLRenderer? renderer;

  int? fboId;
  late double width;
  late double height;

  Size? screenSize;

  late THREE.Scene scene;
  late THREE.Camera camera;
  late THREE.Mesh mesh;

  num dpr = 1.0;

  bool verbose = true;

  late THREE.WebGLRenderTarget renderTarget;

  dynamic? sourceTexture;

  @override
  void initState() {
    super.initState();
  }

  Future<void> initPlatformState() async {
    width = screenSize!.width;
    height = screenSize!.height;

    three3dRender = FlutterGlPlugin();

    Map<String, dynamic> options = {
      "antialias": true,
      "alpha": false,
      "width": width.toInt(),
      "height": height.toInt(),
      "dpr": dpr
    };

    await three3dRender.initialize(options: options);

    setState(() {});

    // TODO web wait dom ok!!!
    Future.delayed(const Duration(milliseconds: 100), () async {
      await three3dRender.prepareContext();

      initScene();
      animate();
    });
  }

  initSize(BuildContext context) {
    if (screenSize != null) {
      return;
    }

    final mqd = MediaQuery.of(context);

    screenSize = mqd.size;
    dpr = mqd.devicePixelRatio;

    initPlatformState();
  }

  render() {
    int _t = DateTime.now().millisecondsSinceEpoch;

    final _gl = three3dRender.gl;

    renderer!.render(scene, camera);

    int _t1 = DateTime.now().millisecondsSinceEpoch;

    if (verbose) {
      print("render cost: ${_t1 - _t} ");
      print(renderer!.info.memory);
      print(renderer!.info.render);
    }

    // 重要 更新纹理之前一定要调用 确保gl程序执行完毕
    _gl.flush();

    // var pixels = _gl.readCurrentPixels(0, 0, 10, 10);
    // print(" --------------pixels............. ");
    // print(pixels);

    if (verbose) print(" render: sourceTexture: ${sourceTexture} ");

    if (!kIsWeb) {
      three3dRender.updateTexture(sourceTexture);
    }
  }

  initRenderer() {
    Map<String, dynamic> options = {
      "width": width,
      "height": height,
      "gl": three3dRender.gl,
      "antialias": true,
      "canvas": three3dRender.element
    };
    renderer = THREE.WebGLRenderer(options);
    renderer!.setPixelRatio(dpr.toDouble());
    renderer!.setSize(width, height, false);
    renderer!.shadowMap.enabled = false;

    if (!kIsWeb) {
      var pars = THREE.WebGLRenderTargetOptions({
        "minFilter": THREE.LinearFilter,
        "magFilter": THREE.LinearFilter,
        "format": THREE.RGBAFormat
      });
      renderTarget = THREE.WebGLMultisampleRenderTarget(
          (width * dpr).toInt(), (height * dpr).toInt(), pars);
      renderer!.setRenderTarget(renderTarget);
      sourceTexture = renderer!.getRenderTargetGLTexture(renderTarget);
    }
  }

  initScene() {
    initRenderer();
    initPage();
  }

  initPage() {
    var aspectRatio = width / height;

    var widthWithPixelRatio = width * dpr;
    var heightWithPixelRatio = height * dpr;

    List<THREE.Camera> cameras = [];
    var subcamera = THREE.PerspectiveCamera(40, aspectRatio, 0.1, 10);
    subcamera.viewport = THREE.Vector4(
        THREE.Math.floor(widthWithPixelRatio),
        THREE.Math.floor(heightWithPixelRatio),
        THREE.Math.ceil(widthWithPixelRatio),
        THREE.Math.ceil(heightWithPixelRatio));
    subcamera.position.x = 0.5;
    subcamera.position.y = 0.5;
    subcamera.position.z = 1.5;
    subcamera.position.multiplyScalar(2);
    subcamera.lookAt(THREE.Vector3(0, 0, 0));
    subcamera.updateMatrixWorld(false);
    cameras.add(subcamera);

    camera = subcamera;
    // camera = new THREE.PerspectiveCamera( 40, 1, 0.1, 10 );
    camera.position.z = 3;

    scene = THREE.Scene();

    camera.lookAt(scene.position);

    //scene.background = THREE.Color(1.0, 1.0, 1.0);
    scene.background = THREE.Color(0x000000);
    scene.add(THREE.AmbientLight(0x222244, null));

    var light = THREE.DirectionalLight(0xffffff, null);
    light.position.set(0.5, 0.5, 1);
    light.castShadow = true;
    light.shadow!.camera!.zoom = 4; // tighter shadow map
    scene.add(light);

    for (var i = 0; i < 200; i++) {
      addCube(0.01);
    }
    for (var i = 0; i < 100; i++) {
      addCube(0.1);
    }
    for (var i = 0; i < 25; i++) {
      addCube(0.15);
    }
    /*   
    for (var i = 0; i < 100; i++) {
      addStar();
    }
    render();

    var scene = THREE.Scene();
    var camera = THREE.PerspectiveCamera(75, aspectRatio, 0.1,
        1000); // fov / aspect ratio / view frustum (near, far)
    camera.position.setZ(30);
    camera.lookAt(scene.position);
    scene.background = THREE.Color(1.0, 1.0, 1.0);

    scene.add(THREE.AmbientLight(0x222244, null));

    var geometry = THREE.TorusGeometry(10, 3, 16, 100);
    var material = THREE.MeshStandardMaterial();
    material.color = 0xFFD700 as THREE.Color;
    var torus = THREE.Mesh(geometry, material);
    scene.add(torus);
    */
  }

  void addCube(double size) {
    var geometry = THREE.BoxGeometry(size, size, size);
    var material = THREE.MeshBasicMaterial({"color": 0xffffff});
    var cube = THREE.Mesh(geometry, material);
    cube.position.set(
        THREE.MathUtils.randFloatSpread(10),
        THREE.MathUtils.randFloatSpread(10),
        THREE.MathUtils.randFloatSpread(10));
    scene.add(cube);
  }

  void addStar() {
    var geometry = THREE.SphereGeometry(0.25, 24, 24);
    var material = THREE.MeshStandardMaterial({"color": 0xffffff});
    var star = THREE.Mesh(geometry, material);

    star.position.set(
        THREE.MathUtils.randFloatSpread(100),
        THREE.MathUtils.randFloatSpread(100),
        THREE.MathUtils.randFloatSpread(100));
    scene.add(star);
  }

  void animate() {
    if (!mounted) {
      return;
    }

    //mesh.rotation.x += 0.005;
    //mesh.rotation.z += 0.01;
    camera.rotateY(0.0009);
    render();

    Future.delayed(const Duration(milliseconds: 16), () {
      animate();
    });
  }

  @override
  void dispose() {
    if (kDebugMode) {
      print(" dispose ............. ");
    }

    three3dRender.dispose();

    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: Scaffold(
          body: GestureDetector(
        onPanUpdate: (details) {
          if (details.delta.dx == 0) {
          } else {
            if (details.delta.dx > 0)
              print("Dragging in +X direction");
            else
              print("Dragging in -X direction");
          }
          if (details.delta.dy == 0) {
          } else {
            if (details.delta.dy > 0)
              print("Dragging in +Y direction");
            else
              print("Dragging in -Y direction");
          }
        },
        child: Stack(
          children: [
            Builder(
              builder: (BuildContext context) {
                initSize(context);
                return Stack(
                  children: [
                    SingleChildScrollView(child: _build(context)),
                    FractionalTranslation(
                      translation: const Offset(0.1, 0.1),
                      child: SizedBox(
                          width: width * 0.8,
                          height: height * 0.8,
                          child: const ColoredBox(
                              color: ui.Color.fromARGB(69, 255, 255, 255))),
                    ),
                  ],
                );
              },
            ),
          ],
        ),
      )),
    );
  }

  Widget _build(BuildContext context) {
    return Column(
      children: [
        Stack(
          children: [
            Container(
                width: width,
                height: height,
                color: Colors.black,
                child: Builder(builder: (BuildContext context) {
                  if (kIsWeb) {
                    return three3dRender.isInitialized
                        ? HtmlElementView(
                            viewType: three3dRender.textureId!.toString())
                        : Container();
                  } else {
                    return three3dRender.isInitialized
                        ? Texture(textureId: three3dRender.textureId!)
                        : Container();
                  }
                })),
          ],
        ),
      ],
    );
  }
}
