import React, { useState, useEffect, useCallback, useRef } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import {
  Paper,
  CardActionArea,
  CardMedia,
  Grid,
  TableContainer,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Button,
  CircularProgress,
  Box,
} from "@material-ui/core";
import { useDropzone } from "react-dropzone";
import { common } from "@material-ui/core/colors";
import Clear from "@material-ui/icons/Clear";
import CloudUpload from "@material-ui/icons/CloudUpload";
import axios from "axios";

const recommendations = {
  "potato early blight": {
    scientificName: "Alternaria solani",
    history: "First identified in the late 19th century, Alternaria solani has been a persistent challenge in potato cultivation, particularly in humid regions, with notable outbreaks shaping modern disease management practices.",
    causes: "Primarily caused by prolonged leaf wetness, warm temperatures (20-25°C), and poor air circulation, often exacerbated by dense planting or overhead irrigation.",
    procedure: "Implement a robust crop rotation with non-host crops like cereals for 2-3 years to break the disease cycle. Enhance field sanitation by removing and destroying infected debris. Apply foliar sprays of Mancozeb (2-2.5 g/L) every 7-10 days during wet conditions, ensuring thorough coverage. Prune lower leaves to improve airflow and reduce humidity. Monitor with regular scouting to adjust application timing.",
  },
  "potato late blight": {
    scientificName: "Phytophthora infestans",
    history: "Known for causing the Irish Potato Famine in the 1840s, this oomycete has evolved into diverse strains, making it a global threat to potato production with significant historical agricultural impact.",
    causes: "Triggered by cool, wet weather (10-18°C) and high humidity, often spread by wind-blown spores from infected plants or soil, intensified by monoculture practices.",
    procedure: "Adopt a 3-year crop rotation with legumes to disrupt spore survival. Use resistant potato varieties where available. Apply Metalaxyl (1.5-2 g/L) preventively every 5-7 days during humid periods, integrating with copper-based fungicides for enhanced control. Ensure proper drainage and avoid overhead watering. Conduct weekly field inspections to detect early lesions and isolate affected plants promptly.",
  },
  "potato healthy": {
    scientificName: "Solanum tuberosum (Healthy)",
    history: "Cultivated for over 7,000 years in the Andes, healthy potato plants reflect successful agronomic practices that have evolved to optimize yield and resilience.",
    causes: "No disease present; maintained by preventive care and optimal growing conditions including well-drained soil and balanced nutrition.",
    procedure: "Continue preventive foliar sprays with Chlorothalonil (2 g/L) every 14 days to safeguard against potential threats. Maintain soil health with organic amendments like compost (5-10 tons/ha) and ensure adequate potassium (150-200 kg/ha) to bolster plant vigor. Monitor soil moisture (60-70% field capacity) and practice intercropping with beans to enhance biodiversity. Regular soil testing is recommended to sustain nutrient balance.",
  },
};

const ColorButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText(common.white),
    backgroundColor: common.white,
    "&:hover": {
      backgroundColor: "#ffffff7a",
    },
  },
}))(Button);

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  clearButton: {
    width: "-webkit-fill-available",
    borderRadius: "15px",
    padding: "15px 22px",
    color: "#000000a6",
    fontSize: "20px",
    fontWeight: 900,
  },
  root: {
    maxWidth: 345,
    flexGrow: 1,
  },
  media: {
    height: 400,
  },
  paper: {
    padding: theme.spacing(2),
    margin: "auto",
    maxWidth: 500,
  },
  gridContainer: {
    justifyContent: "center",
    padding: "4em 1em 4em 1em",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
      alignItems: "center",
    },
  },
  mainContainer: {
    minHeight: "100vh",
    marginTop: "8px",
    paddingBottom: "50px",
  },
  imageCard: {
    margin: "auto",
    maxWidth: 400,
    minHeight: 500,
    backgroundColor: "transparent",
    boxShadow: "0px 9px 70px 0px rgb(0 0 0 / 30%) !important",
    borderRadius: "15px",
    animation: "fadeInUp 0.5s ease-out",
  },
  imageCardEmpty: {
    height: "auto",
    minHeight: 400,
  },
  noImage: {
    margin: "auto",
    width: 400,
    height: "400 !important",
  },
  input: {
    display: "none",
  },
  uploadIcon: {
    background: "white",
  },
  tableContainer: {
    backgroundColor: "transparent !important",
    boxShadow: "none !important",
  },
  table: {
    backgroundColor: "transparent !important",
  },
  tableHead: {
    backgroundColor: "transparent !important",
  },
  tableRow: {
    backgroundColor: "transparent !important",
  },
  tableCell: {
    fontSize: "22px",
    backgroundColor: "transparent !important",
    borderColor: "transparent !important",
    color: "#ffffff !important",
    fontWeight: "900",
    padding: "1px 24px 1px 16px",
    textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)",
  },
  tableCell1: {
    fontSize: "14px",
    backgroundColor: "transparent !important",
    borderColor: "transparent !important",
    color: "#ffffff !important",
    fontWeight: "900",
    padding: "1px 24px 1px 16px",
    textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)",
  },
  tableBody: {
    backgroundColor: "transparent !important",
  },
  text: {
    color: "white !important",
    textAlign: "center",
  },
  buttonGrid: {
    maxWidth: "416px",
    width: "100",
    marginTop: "4px",
  },
  detail: {
    backgroundColor: "white",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
  },
  appbar: {
    background: "#337615",
    boxShadow: "none",
    color: "white",
  },
  loader: {
    color: "#be6a77 !important",
    animation: "spin 2s linear infinite",
  },
  errorText: {
    color: "#d32f2f",
    textAlign: "center",
    padding: "16px",
  },
  predictionCard: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(10px)",
    borderRadius: "15px",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
    animation: "fadeInScale 0.6s ease-out",
    margin: "16px",
    padding: "16px",
  },
  resultsCard: {
    margin: "20px auto",
    maxWidth: 400,
    minHeight: 500,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(10px)",
    borderRadius: "15px",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
    animation: "fadeInScale 0.6s ease-out",
    width: "fit-content",
    [theme.breakpoints.down("sm")]: {
      marginTop: "20px",
      width: "100%",
    },
  },
  predictionTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: "8px",
    animation: "fadeInDown 0.4s ease-out 0.1s both",
    textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)",
  },
  predictionContent: {
    backgroundColor: "transparent",
    padding: "8px",
    marginTop: "4px",
  },
  recommendationSection: {
    marginTop: "16px",
    textAlign: "left",
    width: "100",
    padding: "16px",
    borderTop: "1px solid rgba(0, 0, 0, 0.1)",
    animation: "fadeInUp 0.4s ease-out 0.2s both",
  },
  recommendationTitle: {
    fontSize: "18px", // Increased font size for prominence
    fontWeight: "bold",
    color: "#ff0000", // Red color for the title
    marginBottom: "8px",
    display: "flex",
    alignItems: "center",
    "&::before": {
      content: '"🌱 "', // Red plant emoji
      color: "#ff0000", // Matching red color
      marginRight: "8px",
    },
  },
  recommendationText: {
    fontSize: "16px", // Increased font size for better visibility
    color: "#000000", // Darker color for contrast
    fontWeight: "500", // Bolder style for engagement
    marginBottom: "8px",
    lineHeight: "1.5", // Improved readability
  },
  confidenceBar: {
    width: "100%",
    height: "8px",
    backgroundColor: "#e0e0e0",
    borderRadius: "4px",
    overflow: "hidden",
    marginTop: "4px",
    animation: "fadeInUp 0.4s ease-out 0.3s both",
  },
  confidenceFill: {
    height: "100%",
    background: "linear-gradient(90deg, #ff6b6b, #feca57, #48ca5e)",
    borderRadius: "4px",
    animation: props => `$expandWidthDynamic 0.8s ease-out 0.4s both`,
  },
  title: {
    color: "#000000a6",
    textAlign: "center",
    marginTop: "16px",
    animation: "fadeInUp 0.4s ease-out 0.2s both",
  },
  dropzone: {
    border: "2px dashed #337615",
    borderRadius: "15px",
    padding: "20px",
    textAlign: "center",
    cursor: "pointer",
    backgroundColor: "#f9f9f9",
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: "#f0f0f0",
      borderColor: "#2d5d12",
    },
  },
  dropzoneActive: {
    borderColor: "#2d5d12",
    backgroundColor: "#e8f5e8",
  },
  dropzoneText: {
    fontSize: "16px",
    color: "#337615",
    marginTop: "10px",
    fontWeight: 500,
  },
  mediaContainer: {
    animation: "fadeInScale 0.4s ease-out",
  },
  errorContainer: {
    animation: "fadeInScale 0.6s ease-out",
  },
  loadingContainer: {
    animation: "fadeInScale 0.5s ease-out",
  },
  tableSection: {
    animation: "slideInLeft 0.5s ease-out 0.2s both",
    width: "100",
  },
  confidencePercentage: {
    animation: "fadeIn 0.4s ease-out 0.6s both",
  },
  clearButtonContainer: {
    animation: "fadeInUp 0.5s ease-out",
    width: "100",
    display: "flex",
    justifyContent: "center",
    marginTop: "4px",
  },
  "@keyframes fadeInUp": {
    "0%": {
      opacity: 0,
      transform: "translateY(20px)",
    },
    "100%": {
      opacity: 1,
      transform: "translateY(0)",
    },
  },
  "@keyframes fadeInDown": {
    "0%": {
      opacity: 0,
      transform: "translateY(-10px)",
    },
    "100%": {
      opacity: 1,
      transform: "translateY(0)",
    },
  },
  "@keyframes fadeInScale": {
    "0%": {
      opacity: 0,
      transform: "translateY(50px) scale(0.9)",
    },
    "100%": {
      opacity: 1,
      transform: "translateY(0) scale(1)",
    },
  },
  "@keyframes slideInLeft": {
    "0%": {
      opacity: 0,
      transform: "translateX(-20px)",
    },
    "100%": {
      opacity: 1,
      transform: "translateX(0)",
    },
  },
  "@keyframes expandWidthDynamic": {
    "0%": { width: "0%" },
    "100%": { width: (props) => `${props.confidence || 0}%` },
  },
  "@keyframes fadeIn": {
    "0%": {
      opacity: 0,
    },
    "100%": {
      opacity: 1,
    },
  },
  "@keyframes spin": {
    "0%": {
      transform: "rotate(0deg)",
    },
    "100%": {
      transform: "rotate(360deg)",
    },
  },
}));

export const ImageUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [data, setData] = useState(null);
  const [image, setImage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const isMountedRef = useRef(true);

  let confidence = 0;
  if (data && data.confidence) {
    confidence = parseFloat(data.confidence) || 0;
  }

  const classes = useStyles({ confidence });

  const ENDPOINT = process.env.REACT_APP_URL || "http://localhost:8000/predict";

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      if (rejectedFiles[0].errors[0].code === "file-too-large") {
        setError("File is too large. Maximum size is 5MB.");
      } else if (rejectedFiles[0].errors[0].code === "file-invalid-type") {
        setError("Unsupported file format. Please use JPEG, PNG, GIF, BMP, or WebP.");
      }
      setAnimationKey((prev) => prev + 1);
      return;
    }
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setSelectedFile(file);
      setData(null);
      setImage(true);
      setError(null);
      setShowResult(false);
      setAnimationKey((prev) => prev + 1);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".bmp", ".webp"],
    },
    multiple: false,
    maxSize: 5000000,
  });

  const sendFile = useCallback(async () => {
    if (!image || !selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setError(null);
      setIsLoading(true);

      const res = await axios.post(ENDPOINT, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 30000,
      });

      if (res.status === 200 && isMountedRef.current) {
        setData(res.data);
        setTimeout(() => {
          if (isMountedRef.current) {
            setShowResult(true);
            setAnimationKey((prev) => prev + 1);
          }
        }, 300);
      }
    } catch (err) {
      console.error("Upload failed:", err);
      if (isMountedRef.current) {
        if (err.response) {
          setError(`Server error: ${err.response.status} ${err.response.statusText}`);
        } else if (err.request) {
          setError("Network error: Unable to reach the server. Please check your connection.");
        } else {
          setError(`Upload failed: ${err.message}`);
        }
        setAnimationKey((prev) => prev + 1);
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [image, selectedFile, ENDPOINT]);

  const clearData = () => {
    setShowResult(false);
    setTimeout(() => {
      setData(null);
      setImage(false);
      setSelectedFile(null);
      setPreview(null);
      setError(null);
      setIsLoading(false);
      setAnimationKey((prev) => prev + 1);
    }, 300);
  };

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedFile) {
      setPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [selectedFile]);

  useEffect(() => {
    if (!preview || !isMountedRef.current) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setShowResult(false);
    setAnimationKey((prev) => prev + 1);
    sendFile();
  }, [preview, sendFile]);

  return (
    <React.Fragment>
      <AppBar position="static" className={classes.appbar}>
        <Toolbar>
          <Typography variant="h6" noWrap>
            🥔 Potato Disease Classification
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth={false} className={classes.mainContainer} disableGutters={true}>
        <Grid
          className={classes.gridContainer}
          container
          direction="row"
          justifyContent="center"
          alignItems="flex-start"
          spacing={1}
        >
          <Grid item xs={12} md={6}>
            <Card className={`${classes.imageCard} ${!image ? classes.imageCardEmpty : ""}`}>
              {image && preview && (
                <div className={classes.mediaContainer} key={`media-${animationKey}`}>
                  <CardActionArea>
                    <CardMedia
                      className={classes.media}
                      image={preview}
                      component="img"
                      title="Potato Plant Leaf"
                      alt="Uploaded potato plant leaf for disease classification"
                    />
                  </CardActionArea>
                </div>
              )}
              {!image && (
                <CardContent>
                  <Box
                    {...getRootProps()}
                    className={`${classes.dropzone} ${isDragActive ? classes.dropzoneActive : ""}`}
                  >
                    <input {...getInputProps()} />
                    <CloudUpload style={{ fontSize: 48, color: "#337615" }} />
                    <Typography className={classes.dropzoneText}>
                      {isDragActive
                        ? "OKEYI DID IT..."
                        : "Drag and drop an image of a potato plant leaf here, or click to select"}
                    </Typography>
                    <Typography variant="caption" style={{ color: "#666", marginTop: "8px" }}>
                      Supported formats: JPEG, PNG, GIF, BMP, WebP (Max 5MB)
                    </Typography>
                  </Box>
                </CardContent>
              )}

              {error && (
                <div className={classes.errorContainer} key={`error-${animationKey}`}>
                  <CardContent>
                    <Typography className={classes.errorText} variant="body1">
                      {error}
                    </Typography>
                  </CardContent>
                </div>
              )}

              {isLoading && (
                <div className={classes.loadingContainer} key={`loading-${animationKey}`}>
                  <CardContent className={classes.detail}>
                    <div>
                      <CircularProgress color="secondary" className={classes.loader} />
                    </div>
                    <div>
                      <Typography className={classes.title} variant="h6" noWrap>
                        🧠 Analyzing Image...
                      </Typography>
                    </div>
                  </CardContent>
                </div>
              )}

              {data && !error && (
                <CardContent className={classes.predictionContent}>
                  <Typography className={classes.predictionTitle} variant="h6">
                    🔍 Prediction Results
                  </Typography>
                  <div className={classes.tableSection}>
                    <TableContainer component={Paper} className={classes.tableContainer}>
                      <Table className={classes.table} size="small" aria-label="prediction results">
                        <TableHead className={classes.tableHead}>
                          <TableRow className={classes.tableRow}>
                            <TableCell className={classes.tableCell1}>Disease:</TableCell>
                            <TableCell align="right" className={classes.tableCell1}>Confidence:</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody className={classes.tableBody}>
                          <TableRow className={classes.tableRow}>
                            <TableCell component="th" scope="row" className={classes.tableCell}>
                              {data.class || "Unknown"}
                            </TableCell>
                            <TableCell align="right" className={classes.tableCell}>
                              <span className={classes.confidencePercentage}>
                                {confidence.toFixed(2)}%
                              </span>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                  <div className={classes.confidenceBar}>
                    <div className={classes.confidenceFill} />
                  </div>
                </CardContent>
              )}
            </Card>

            {(data || error) && (
              <Grid item xs={12} className={classes.clearButtonContainer} key={`button-${animationKey}`}>
                <div className={classes.buttonGrid}>
                  <ColorButton
                    variant="contained"
                    className={classes.clearButton}
                    color="primary"
                    component="span"
                    size="large"
                    onClick={clearData}
                    startIcon={<Clear fontSize="large" />}
                    aria-label="Clear uploaded image and results"
                  >
                    Clear
                  </ColorButton>
                </div>
              </Grid>
            )}
          </Grid>

          {data && showResult && !error && (
            <Grid item xs={12} md={6}>
              <Card className={classes.resultsCard} key={`results-${animationKey}`}>
                <CardContent className={classes.detail}>
                  <Typography className={classes.predictionTitle} variant="h6">
                    🌱 Recommendations
                  </Typography>
                  <div className={classes.recommendationSection}>
                    <Typography className={classes.recommendationTitle} variant="subtitle1">
                      Recommendations
                    </Typography>
                    {(() => {
                      const normalizedClass = data.class.toLowerCase().trim();
                      const rec = recommendations[normalizedClass];
                      return rec ? (
                        <>
                          <Typography className={classes.recommendationText}>
                            <strong>Scientific Name:</strong> {rec.scientificName}
                          </Typography>
                          <Typography className={classes.recommendationText}>
                            <strong>History:</strong> {rec.history}
                          </Typography>
                          <Typography className={classes.recommendationText}>
                            <strong>Causes:</strong> {rec.causes}
                          </Typography>
                          <Typography className={classes.recommendationText}>
                            <strong>Procedure:</strong> {rec.procedure}
                          </Typography>
                        </>
                      ) : (
                        <Typography className={classes.recommendationText} color="error">
                          No recommendations available for {data.class}.
                        </Typography>
                      );
                    })()}
                  </div>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </Container>
    </React.Fragment>
  );
};