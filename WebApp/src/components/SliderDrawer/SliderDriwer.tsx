import { useState, useRef, ReactNode, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Button } from 'antd'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { divideArrayIntoGroups } from '../../utils/divideArrayIntoGroups'
import type { ArrayIntoGroupsType } from '../../utils/divideArrayIntoGroups'
import { useContainerDimensions } from '../../hooks/useContainerDimention'


interface IProps<TArray> {
  dataSource: TArray[],
  open: boolean,
  visibleAmount: number,
  render: (element: TArray) => ReactNode
}

/**
 * 
 * @param dataSource initial data array. Generic<TArray>
 * @param open true/false SliderDriwer open/close state
 * @param visibleAmount amount of visible elements inside `SliderDriwer` component
 * @param render ReactNode. Rendedred element of `SliderDriwer` component
 */
export const SliderDriwer = <TArray,>({dataSource, open, visibleAmount, render}: IProps<TArray>) => {
  const [data, setData] = useState<ArrayIntoGroupsType<TArray>>(divideArrayIntoGroups(dataSource, visibleAmount))
  const [slide, setSlide] = useState<number>(0)

  const groupsPars = useRef<HTMLInputElement>(null)
  const { width } = useContainerDimensions(groupsPars)

  const slideLeft = () => {
    if (slide < 1) {
      setSlide(0)
    } else {
      setSlide(slide - 1)
    }
  }
  const slideRight = () => {
    if (slide > data.length - 2) {
      setSlide(slide)
    } else {
      setSlide(slide + 1)
    }
  }

  useEffect(() => {
    setSlide(0)
    setData(divideArrayIntoGroups(dataSource, visibleAmount))
  }, [dataSource, open])

  return (
    <AnimatePresence>
      <motion.div 
        className="flex flex-col gap-2" 
        style={{ height: open ? '100%' : '0px', overflow: 'hidden' }}
        initial={{ height: 'auto' }}
        animate={{ height: open ? 'auto' : 0 }}
        transition={{ duration: 0.15, type: 'tween' }}
      >
        <AnimatePresence>
          <motion.div 
            className="flex"
            animate={{
              x: -slide * width,
              transition: {type: 'spring', bounce: 0.1, duration: 0.3}
            }}
          >
            {data.map((dividedArray, index) => (
              <motion.div 
                key={index}
                ref={groupsPars} 
                className="flex flex-col min-w-full gap-2"
                initial={{ scale: slide === index ? 1 : 0.8 }}
                animate={{ scale: slide === index ? 1 : 0.8 }}
                transition={{ duration: 0.15 }}
              >
                {dividedArray.map((group: any, index) => (
                  <AnimatePresence key={index}>
                    <motion.div 
                      key={index}
                      initial={{ scale: open ? 1 : 0.8 }}
                      animate={{ scale: open ? 1 : 0.8 }}
                      transition={{ duration: 0.15, delay: 0.04 * index }}
                    >
                      <div className="flex gap-4 items-enter w-full">
                        {render && render(group)}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                ))}
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
        <div className="flex justify-between items-center">
          <Button 
            disabled={slide < 1 ? true : false}
            type='text' 
            style={{ margin: '0 0', padding: '0 9px' }}
            onClick={() => slideLeft()}
          >
            <LeftOutlined />
          </Button>
          {slide + 1}
          <Button 
            disabled={slide > data.length - 2 ? true : false}
            type='text' 
            style={{ margin: '0 0', padding: '0 9px' }}
            onClick={() => slideRight()}
          >
            <RightOutlined />
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
