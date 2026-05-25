"use client"

import React, {
  useEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
} from "react"

import { cn } from "@/lib/cn"

interface MousePosition {
  x: number
  y: number
}

function MousePosition(): MousePosition {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
  })

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return mousePosition
}

type ParticleVariant = "dot" | "medical"
type LabShape = "microscope" | "bloodCell" | "testTube"

interface ParticlesProps extends ComponentPropsWithoutRef<"div"> {
  className?: string
  quantity?: number
  staticity?: number
  ease?: number
  size?: number
  refresh?: boolean
  color?: string
  vx?: number
  vy?: number
  variant?: ParticleVariant
}

const LAB_SHAPES: LabShape[] = ["microscope", "bloodCell", "testTube"]
const BLOOD_RGB: [number, number, number] = [198, 40, 40]
const BLOOD_LIGHT_RGB: [number, number, number] = [239, 154, 154]

function drawBloodCellDisc(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  alpha: number
) {
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, Math.PI * 2)
  ctx.fillStyle = `rgba(${BLOOD_RGB.join(", ")}, ${alpha * 0.7})`
  ctx.fill()

  ctx.beginPath()
  ctx.arc(x, y, radius * 0.42, 0, Math.PI * 2)
  ctx.fillStyle = `rgba(${BLOOD_LIGHT_RGB.join(", ")}, ${alpha * 0.55})`
  ctx.fill()
}

function drawLabShape(
  ctx: CanvasRenderingContext2D,
  shape: LabShape,
  x: number,
  y: number,
  size: number,
  rgb: number[],
  alpha: number,
  rotation: number
) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(rotation)

  const s = size * 3

  switch (shape) {
    case "microscope": {
      const radius = s * 0.58
      ctx.beginPath()
      ctx.arc(0, 0, radius, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${rgb.join(", ")}, ${alpha * 0.06})`
      ctx.fill()
      ctx.strokeStyle = `rgba(${rgb.join(", ")}, ${alpha * 0.5})`
      ctx.lineWidth = Math.max(0.6, s * 0.055)
      ctx.stroke()

      ctx.beginPath()
      ctx.arc(0, 0, radius * 0.72, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(${rgb.join(", ")}, ${alpha * 0.18})`
      ctx.lineWidth = Math.max(0.4, s * 0.025)
      ctx.stroke()

      const cells: [number, number, number][] = [
        [-radius * 0.22, -radius * 0.12, 0.13],
        [radius * 0.18, radius * 0.16, 0.11],
        [-radius * 0.04, radius * 0.28, 0.1],
        [radius * 0.3, -radius * 0.24, 0.09],
        [-radius * 0.32, radius * 0.08, 0.08],
      ]

      for (const [cx, cy, cr] of cells) {
        drawBloodCellDisc(ctx, cx, cy, radius * cr, alpha)
      }
      break
    }
    case "bloodCell": {
      drawBloodCellDisc(ctx, 0, 0, s * 0.48, alpha)
      break
    }
    case "testTube": {
      const w = s * 0.4
      const h = s * 1.2
      const capH = s * 0.14

      ctx.fillStyle = `rgba(${rgb.join(", ")}, ${alpha * 0.65})`
      ctx.beginPath()
      ctx.roundRect(-w * 0.55, -h / 2 - capH, w * 1.1, capH, capH * 0.2)
      ctx.fill()

      ctx.strokeStyle = `rgba(${rgb.join(", ")}, ${alpha * 0.45})`
      ctx.lineWidth = Math.max(0.5, s * 0.045)
      ctx.beginPath()
      ctx.roundRect(-w / 2, -h / 2, w, h, w * 0.18)
      ctx.stroke()

      const inset = s * 0.04
      const fillH = h * 0.44
      const left = -w / 2 + inset
      const right = w / 2 - inset
      const bottom = h / 2 - inset
      const top = bottom - fillH
      const corner = w * 0.14

      ctx.fillStyle = `rgba(${BLOOD_RGB.join(", ")}, ${alpha * 0.78})`
      ctx.beginPath()
      ctx.moveTo(left, top)
      ctx.lineTo(right, top)
      ctx.lineTo(right, bottom - corner)
      ctx.quadraticCurveTo(right, bottom, right - corner, bottom)
      ctx.lineTo(left + corner, bottom)
      ctx.quadraticCurveTo(left, bottom, left, bottom - corner)
      ctx.closePath()
      ctx.fill()

      ctx.fillStyle = `rgba(${BLOOD_LIGHT_RGB.join(", ")}, ${alpha * 0.35})`
      ctx.fillRect(left + w * 0.08, top + fillH * 0.15, w * 0.12, fillH * 0.55)
      break
    }
  }

  ctx.restore()
}

function hexToRgb(hex: string): number[] {
  hex = hex.replace("#", "")

  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("")
  }

  const hexInt = parseInt(hex, 16)
  const red = (hexInt >> 16) & 255
  const green = (hexInt >> 8) & 255
  const blue = hexInt & 255
  return [red, green, blue]
}

type Particle = {
  x: number
  y: number
  translateX: number
  translateY: number
  size: number
  alpha: number
  targetAlpha: number
  dx: number
  dy: number
  magnetism: number
  shape: LabShape
  rotation: number
}

export const Particles: React.FC<ParticlesProps> = ({
  className = "",
  quantity = 100,
  staticity = 50,
  ease = 50,
  size = 0.4,
  refresh = false,
  color = "#ffffff",
  vx = 0,
  vy = 0,
  variant = "dot",
  ...props
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const canvasContainerRef = useRef<HTMLDivElement>(null)
  const context = useRef<CanvasRenderingContext2D | null>(null)
  const particles = useRef<Particle[]>([])
  const mousePosition = MousePosition()
  const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const canvasSize = useRef<{ w: number; h: number }>({ w: 0, h: 0 })
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1
  const rafID = useRef<number | null>(null)
  const resizeTimeout = useRef<NodeJS.Timeout | null>(null)
  const initCanvasRef = useRef<() => void>(() => {})
  const onMouseMoveRef = useRef<() => void>(() => {})
  const animateRef = useRef<() => void>(() => {})

  useEffect(() => {
    if (canvasRef.current) {
      context.current = canvasRef.current.getContext("2d")
    }
    initCanvasRef.current()
    animateRef.current()

    const handleResize = () => {
      if (resizeTimeout.current) {
        clearTimeout(resizeTimeout.current)
      }
      resizeTimeout.current = setTimeout(() => {
        initCanvasRef.current()
      }, 200)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      if (rafID.current != null) {
        window.cancelAnimationFrame(rafID.current)
      }
      if (resizeTimeout.current) {
        clearTimeout(resizeTimeout.current)
      }
      window.removeEventListener("resize", handleResize)
    }
  }, [color])

  useEffect(() => {
    onMouseMoveRef.current()
  }, [mousePosition.x, mousePosition.y])

  useEffect(() => {
    initCanvasRef.current()
  }, [refresh])

  const initCanvas = () => {
    resizeCanvas()
    drawParticles()
  }

  const onMouseMove = () => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect()
      const { w, h } = canvasSize.current
      const x = mousePosition.x - rect.left - w / 2
      const y = mousePosition.y - rect.top - h / 2
      const inside = x < w / 2 && x > -w / 2 && y < h / 2 && y > -h / 2
      if (inside) {
        mouse.current.x = x
        mouse.current.y = y
      }
    }
  }

  const resizeCanvas = () => {
    if (canvasContainerRef.current && canvasRef.current && context.current) {
      canvasSize.current.w = canvasContainerRef.current.offsetWidth
      canvasSize.current.h = canvasContainerRef.current.offsetHeight

      canvasRef.current.width = canvasSize.current.w * dpr
      canvasRef.current.height = canvasSize.current.h * dpr
      canvasRef.current.style.width = `${canvasSize.current.w}px`
      canvasRef.current.style.height = `${canvasSize.current.h}px`
      context.current.scale(dpr, dpr)

      particles.current = []
      for (let i = 0; i < quantity; i++) {
        const particle = particleParams()
        drawParticle(particle)
      }
    }
  }

  const particleParams = (): Particle => {
    const x = Math.floor(Math.random() * canvasSize.current.w)
    const y = Math.floor(Math.random() * canvasSize.current.h)
    const translateX = 0
    const translateY = 0
    const pSize =
      variant === "medical"
        ? size + Math.random() * 1.2
        : Math.floor(Math.random() * 2) + size
    const alpha = 0
    const targetAlpha = parseFloat((Math.random() * 0.6 + 0.1).toFixed(1))
    const dx = (Math.random() - 0.5) * 0.1
    const dy = (Math.random() - 0.5) * 0.1
    const magnetism = 0.1 + Math.random() * 4
    const shape = LAB_SHAPES[Math.floor(Math.random() * LAB_SHAPES.length)]
    return {
      x,
      y,
      translateX,
      translateY,
      size: pSize,
      alpha,
      targetAlpha,
      dx,
      dy,
      magnetism,
      shape,
      rotation: Math.random() * Math.PI * 2,
    }
  }

  const rgb = hexToRgb(color)

  const particleBounds = (particle: Particle) =>
    variant === "medical" ? particle.size * 4 : particle.size

  const drawParticle = (particle: Particle, update = false) => {
    if (context.current) {
      const { x, y, translateX, translateY, size, alpha, shape, rotation } =
        particle
      context.current.translate(translateX, translateY)

      if (variant === "medical") {
        drawLabShape(
          context.current,
          shape,
          x,
          y,
          size,
          rgb,
          alpha,
          rotation
        )
      } else {
        context.current.beginPath()
        context.current.arc(x, y, size, 0, 2 * Math.PI)
        context.current.fillStyle = `rgba(${rgb.join(", ")}, ${alpha})`
        context.current.fill()
      }

      context.current.setTransform(dpr, 0, 0, dpr, 0, 0)

      if (!update) {
        particles.current.push(particle)
      }
    }
  }

  const clearContext = () => {
    if (context.current) {
      context.current.clearRect(
        0,
        0,
        canvasSize.current.w,
        canvasSize.current.h
      )
    }
  }

  const drawParticles = () => {
    clearContext()
    const particleCount = quantity
    for (let i = 0; i < particleCount; i++) {
      const particle = particleParams()
      drawParticle(particle)
    }
  }

  const remapValue = (
    value: number,
    start1: number,
    end1: number,
    start2: number,
    end2: number
  ): number => {
    const remapped =
      ((value - start1) * (end2 - start2)) / (end1 - start1) + start2
    return remapped > 0 ? remapped : 0
  }

  const animate = () => {
    clearContext()
    particles.current.forEach((particle: Particle, i: number) => {
      const bounds = particleBounds(particle)
      const edge = [
        particle.x + particle.translateX - bounds,
        canvasSize.current.w - particle.x - particle.translateX - bounds,
        particle.y + particle.translateY - bounds,
        canvasSize.current.h - particle.y - particle.translateY - bounds,
      ]
      const closestEdge = edge.reduce((a, b) => Math.min(a, b))
      const remapClosestEdge = parseFloat(
        remapValue(closestEdge, 0, 20, 0, 1).toFixed(2)
      )
      if (remapClosestEdge > 1) {
        particle.alpha += 0.02
        if (particle.alpha > particle.targetAlpha) {
          particle.alpha = particle.targetAlpha
        }
      } else {
        particle.alpha = particle.targetAlpha * remapClosestEdge
      }
      particle.x += particle.dx + vx
      particle.y += particle.dy + vy
      particle.translateX +=
        (mouse.current.x / (staticity / particle.magnetism) -
          particle.translateX) /
        ease
      particle.translateY +=
        (mouse.current.y / (staticity / particle.magnetism) -
          particle.translateY) /
        ease

      drawParticle(particle, true)

      if (
        particle.x < -bounds ||
        particle.x > canvasSize.current.w + bounds ||
        particle.y < -bounds ||
        particle.y > canvasSize.current.h + bounds
      ) {
        particles.current.splice(i, 1)
        const newParticle = particleParams()
        drawParticle(newParticle)
      }
    })
    rafID.current = window.requestAnimationFrame(animateRef.current)
  }

  initCanvasRef.current = initCanvas
  onMouseMoveRef.current = onMouseMove
  animateRef.current = animate

  return (
    <div
      className={cn("pointer-events-none", className)}
      ref={canvasContainerRef}
      aria-hidden="true"
      {...props}
    >
      <canvas ref={canvasRef} className="size-full" />
    </div>
  )
}
