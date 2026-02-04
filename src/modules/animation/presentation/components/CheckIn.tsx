import useFetchSprite from '../hooks/use-fetch-sprite';

const CheckIn = () => {
  const { sprite } = useFetchSprite('CheckIn');
  return (
    <div>
        <div style={{
            backgroundImage: `url(${sprite?.getFramesData()[0]})`,
            width: `${sprite?.getWidth()}px`,
            height: `${sprite?.getHeight()}px`,
            imageRendering: 'pixelated'
        }}  />
    </div>
  )
}

export default CheckIn