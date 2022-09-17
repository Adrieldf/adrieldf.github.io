import 'package:adrieldfwebsite/webgl_background.dart';
import 'package:flutter/material.dart';
import 'package:three_dart/three_dart.dart' as THREE;

void main() {
  runApp(const /*MyApp()*/ WebGLBackground());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Adrieldf Website',
      theme: ThemeData(
        primarySwatch: Colors.green,
      ),
      home: const MyHomePage(title: 'Flutter Demo Home Page'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({Key? key, required this.title}) : super(key: key);
  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  int _counter = 0;

  void _incrementCounter() {
    var camera = THREE.PerspectiveCamera(40, 1, 0.1, 10);
    camera.position.z = 3;

    setState(() {
      _counter++;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            ElevatedButton(
                onPressed: () => {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                            builder: (context) => const WebGLBackground()),
                      )
                    },
                child: const Text("camera array"))
          ],
        ),
      ),
    );
  }
}
