"use client"

import { useRef, useEffect, useState } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function GlobeVisualization() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!containerRef.current) return

    let animationFrameId: number
    let renderer: THREE.WebGLRenderer
    let controls: OrbitControls

    // Create scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x000000)

    // Create camera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000,
    )
    camera.position.z = 2

    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    containerRef.current.appendChild(renderer.domElement)

    // Add orbit controls
    controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.rotateSpeed = 0.5

    // Create globe
    const globeGeometry = new THREE.SphereGeometry(1, 64, 64)

    // Load earth texture
    const textureLoader = new THREE.TextureLoader()
    textureLoader.load(
      "/earth.webp",
      (earthTexture) => {
        const earthMaterial = new THREE.MeshPhongMaterial({
          map: earthTexture,
          bumpScale: 0.05,
          specular: new THREE.Color(0x333333),
          shininess: 5,
        })

        const globe = new THREE.Mesh(globeGeometry, earthMaterial)
        scene.add(globe)

        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
        scene.add(ambientLight)

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
        directionalLight.position.set(5, 3, 5)
        scene.add(directionalLight)

        // Add point markers for major cities
        const cities = [
          { name: "New York", lat: 40.7128, lng: -74.006, color: 0xff0000, size: 0.02 },
          { name: "London", lat: 51.5074, lng: -0.1278, color: 0x00ff00, size: 0.02 },
          { name: "Tokyo", lat: 35.6762, lng: 139.6503, color: 0x0000ff, size: 0.02 },
          { name: "Sydney", lat: -33.8688, lng: 151.2093, color: 0xffff00, size: 0.02 },
          { name: "Rio de Janeiro", lat: -22.9068, lng: -43.1729, color: 0xff00ff, size: 0.02 },
        ]

        cities.forEach((city) => {
          // Convert lat/lng to 3D coordinates
          const phi = (90 - city.lat) * (Math.PI / 180)
          const theta = (city.lng + 180) * (Math.PI / 180)

          const x = -1 * Math.sin(phi) * Math.cos(theta)
          const y = Math.cos(phi)
          const z = Math.sin(phi) * Math.sin(theta)

          const markerGeometry = new THREE.SphereGeometry(city.size, 16, 16)
          const markerMaterial = new THREE.MeshBasicMaterial({ color: city.color })
          const marker = new THREE.Mesh(markerGeometry, markerMaterial)

          marker.position.set(x, y, z)
          globe.add(marker)

          // Add glow effect
          const glowGeometry = new THREE.SphereGeometry(city.size * 1.5, 16, 16)
          const glowMaterial = new THREE.MeshBasicMaterial({
            color: city.color,
            transparent: true,
            opacity: 0.3,
          })
          const glow = new THREE.Mesh(glowGeometry, glowMaterial)
          glow.position.set(x, y, z)
          globe.add(glow)
        })

        // Animation loop
        const animate = () => {
          animationFrameId = requestAnimationFrame(animate)

          // Rotate globe slowly
          globe.rotation.y += 0.001

          controls.update()
          renderer.render(scene, camera)
        }

        setLoading(false)
        animate()
      },
      undefined,
      (error) => {
        console.error("Error loading texture:", error)
        setLoading(false)
      },
    )

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return

      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    }

    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "" // Clear the container
      }
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationFrameId)
      renderer.dispose()
    }
  }, [])

  return (
    <Card className="col-span-1 lg:col-span-2 overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Global Data Visualization</CardTitle>
        <CardDescription>Interactive 3D globe showing key metrics by location</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-[400px] w-full rounded-md" />
        ) : (
          <div
            ref={containerRef}
            className="h-[400px] w-full rounded-md overflow-hidden"
            aria-label="Interactive 3D globe visualization"
            role="img"
          />
        )}
      </CardContent>
    </Card>
  )
}
