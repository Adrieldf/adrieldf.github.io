"use client";

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    Potree: any;
  }
}

export default function PotreeViewer() {
  const viewerContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load Potree scripts dynamically
    const loadPotreeScripts = async () => {
      // Load Potree stylesheet
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '/potree/potree.css';
      document.head.appendChild(link);

      // Load Potree scripts
      const scripts = [
        '/potree/libs/other/BinaryHeap.js',
        '/potree/libs/other/worker-pool.js',
        '/potree/libs/tween/tween.min.js',
        '/potree/libs/d3/d3.js',
        '/potree/libs/proj4/proj4.js',
        '/potree/libs/openlayers3/ol.js',
        '/potree/potree.js',
      ];

      for (const src of scripts) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = src;
          script.onload = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
        });
      }

      // Initialize Potree viewer
      if (viewerContainerRef.current && window.Potree) {
        const viewer = new window.Potree.Viewer(viewerContainerRef.current);
        
        viewer.setEDLEnabled(true);
        viewer.setFOV(60);
        viewer.setPointBudget(1_000_000);
        viewer.loadSettingsFromURL();
        
        // Load point cloud
        window.Potree.loadPointCloud("/potree/pointclouds/example/cloud.js", "Example Point Cloud", (e: any) => {
          viewer.scene.addPointCloud(e.pointcloud);
          
          e.pointcloud.material.size = 1;
          e.pointcloud.material.pointSizeType = window.Potree.PointSizeType.ADAPTIVE;
          
          viewer.fitToScreen();
        });
      }
    };

    loadPotreeScripts();

    // Cleanup
    return () => {
      // Remove dynamically added scripts and styles
      const scripts = document.querySelectorAll('script[src*="potree"]');
      const styles = document.querySelectorAll('link[href*="potree"]');
      
      scripts.forEach(script => script.remove());
      styles.forEach(style => style.remove());
    };
  }, []);

  return (
    <div className="w-full h-screen">
      <div ref={viewerContainerRef} className="w-full h-full" />
    </div>
  );
} 