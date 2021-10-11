import React, { memo } from 'react';
import PropTypes from 'prop-types';
import CONSTANTS from 'Games/fashionCents/fcConstants';
import './FashionCents.css';


const propTypes = {
    images: PropTypes.arrayOf(PropTypes.string),
    imageClassName: PropTypes.string
}

const defaultProps = {
    images: [],
    imageClassName: ""
}

const ImageStackView = (props) => {
    let {images, imageClassName} = props;

    return (
        <>
            {images?.length > 0 && images.slice(0).reverse().map(
                (image, index) =>{
                    return (
                        <img
                            className={imageClassName}
                            src={CONSTANTS.BASE_URL+image}
                            alt={"card"}
                            key={image+index}
                        />)
                })
            }
        </>
    );
}
ImageStackView.propTypes = propTypes;
ImageStackView.defaultProps = defaultProps;

export default memo(ImageStackView, (prevProps, nextProps)=>{
    if( prevProps.images.length !== nextProps.images.length ||
        prevProps.imageClassName !== nextProps.imageClassName){
        return false;
    }

    for( let imageIndex in prevProps.images){
        if(prevProps.images[imageIndex] !== nextProps.images[imageIndex]){
            return false;
        }
    }
    return true;
});
