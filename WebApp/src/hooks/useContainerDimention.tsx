import { useState, useEffect } from 'react'

type propsType = React.RefObject<HTMLInputElement>

type dimentionsType = {
  width: number,
  height: number
}

export const useContainerDimensions = (myRef: propsType): dimentionsType => {
  const getDimensions = () => {
    if (myRef.current) {
      return { width: myRef.current.offsetWidth, height: myRef.current.offsetHeight }
    }

    return { width: 0, height: 0 }
  }

  const [dimensions, setDimensions] = useState<dimentionsType>({ width: 0, height: 0 })

  useEffect(() => {
    const handleResize = () => {
      setDimensions(getDimensions())
    }
    if (myRef.current) {
      setDimensions(getDimensions())
    }
    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [myRef])

  return dimensions;
};