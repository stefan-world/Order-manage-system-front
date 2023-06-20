/* eslint-disable react/no-array-index-key */
import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useDropzone } from 'react-dropzone';
import {
  Grid,
  Typography,
  makeStyles
} from '@material-ui/core';


const useStyles = makeStyles((theme) => ({
  root: {
    display:'flex',

  },
  dropZone: {
    border: `2px dashed ${theme.palette.divider}`,
    outline: 'none',
    justifyContent: 'center',
    flexWrap: 'wrap',
    display:'flex',
    alignItems: 'center',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
      opacity: 0.5,
      cursor: 'pointer'
    }
  },
  dragActive: {
    backgroundColor: theme.palette.action.active,
    opacity: 0.5
  },
  image: {
    width: 80
  },
  content:{
    textAlign:'center'
  }

}));

function FilesDropzone({ className, value, avatar, ...rest }) {
  const classes = useStyles();
  const [files, setFiles] = useState([]);
   const [preview, setPreview] = useState(avatar);

  useEffect(()=>{
   value(files);
  },[files])

  const handleDrop = useCallback((acceptedFiles) => {
    setFiles(acceptedFiles[0]);
    const objectUrl = URL.createObjectURL(acceptedFiles[0]);
    setPreview(objectUrl);
    
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop
  });

  return (
    <Grid
      className={clsx(classes.root, className)}
      container
      {...rest}
    >
      <Grid item lg={6} md={6} sm={12}  className={classes.content}>
        <img alt='No selected!' src={preview} width="200px" height="150px"/>
      </Grid>
      <Grid
        className={clsx({
          [classes.dropZone]: true,
          [classes.dragActive]: isDragActive
        })}
        item lg={6} md={6} sm={12}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <div>
          <img
            alt="Select file"
            className={classes.image}
            src="/static/images/undraw_add_file2_gvbb.svg"
          />
        </div>
        <div>
          <Typography
            gutterBottom
            variant="h3"
          >
            Select product image
          </Typography>
        </div>
      </Grid>
    </Grid>
  );
}

FilesDropzone.propTypes = {
  className: PropTypes.string
};

export default FilesDropzone;
