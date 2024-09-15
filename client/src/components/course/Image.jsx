
// eslint-disable-next-line react/prop-types
const ImageComponent = ({ fileUrl }) => {
  const imgStyle = {
    maxWidth: '40%',
  };
  return (
    <div>
      <img src={fileUrl} alt='image' style={imgStyle} />
    </div>
  );
};

export default ImageComponent;
