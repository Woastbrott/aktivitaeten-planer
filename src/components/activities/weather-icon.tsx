import {
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  Cloudy,
  Sun,
} from "lucide-react"

export function WeatherIcon({
  code,
  className,
}: {
  code: number
  className?: string
}) {
  if (code === 0 || code === 1) return <Sun className={className} aria-hidden />
  if (code === 2 || code === 3) return <Cloudy className={className} aria-hidden />
  if (code === 45 || code === 48)
    return <CloudFog className={className} aria-hidden />
  if (code >= 51 && code <= 57)
    return <CloudDrizzle className={className} aria-hidden />
  if ((code >= 71 && code <= 77) || code === 85 || code === 86)
    return <CloudSnow className={className} aria-hidden />
  if (code >= 95) return <CloudLightning className={className} aria-hidden />
  if (code >= 61 && code <= 82)
    return <CloudRain className={className} aria-hidden />
  return <Cloudy className={className} aria-hidden />
}
