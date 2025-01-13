import React, { useRef, useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Tooltip,
  Divider
} from "@mui/material";
import axios from "axios";
import genderlyLogo from './assets/image_genderly.png';
import unmglogo from './assets/UNESCO_MGIEP_Logo.jpg';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { FormatItalic, HorizontalRule } from "@mui/icons-material";

const App = () => {
  const [inputText, setInputText] = useState("");
  const [moderationResult, setModerationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [isCopied, setIsCopied] = React.useState(false);
  const resultVal = useRef(null);

  const handleInfo = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setModerationResult(null);

    try {
      const response = await axios.post(
        "LmabdaAPIURL",
        { prompt: inputText },
        {
          headers: {
            "x-api-key": "Key",
            "x-api-secret": "Secret",
            "Content-Type": "application/json"
          }
        }
      );

      const rawJson = response.data.generation;
      const parsed = JSON.parse(rawJson);
      setModerationResult(parsed);
    } catch (error) {
      console.error("API Error:", error);
      setModerationResult({
        error: "An error occurred. Please check console for details."
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleCopy = () => {
    navigator.clipboard.writeText(resultVal.current.innerHTML);
    setIsCopied(true);
    setTimeout( () => {
      setIsCopied(false)
    },2000);
  }
  return (
    <>
    <div id="main">
    <Container sx={{display:"flex",flexDirection:"column",flex:1}}>
        <Box
          component="img"
          src={genderlyLogo}
          alt="Genderly"
          sx={{
            width: 150,
            mx:"auto",
            height: 'auto',
            mb: 2
          }}
        />
        <Typography sx={{textAlign:"right",color:"#555",fontStyle:"italic"}}>Beta Release &nbsp;</Typography>

        <TextField
          label="Type or paste your text to check for gender-sensitive and inclusive language"
          multiline
          rows={6}
          fullWidth
          variant="outlined"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          sx={{
            
            mb: 2
          }}
        />
        <Box sx={{display:"flex",justifyContent:"flex-end",mb:2}}>
          <IconButton color="primary" onClick={handleInfo}>
            <TipsAndUpdatesIcon />
          </IconButton>
          <Button
            variant="contained"
            size="large"
            onClick={handleSubmit}
            disabled={loading || !inputText.trim()}
            startIcon
            endIcon={loading ? <CircularProgress size={24} color="inherit" /> : ""}
            sx={{color:"#fff",bgcolor:"#094050fc"}}
          >
            Submit for Moderation
          </Button>
        </Box>

        {moderationResult && (
          <Box sx={{p:1,border:1,borderRadius:1,borderColor:"#ccc"}}>
            {moderationResult.error ? (
              <Typography color="error">{moderationResult.error}</Typography>
            ) : (
              <>
                <Typography variant="h6" gutterBottom>
                  Moderation Result
                </Typography>

                <Typography>
                  <strong>Safe?</strong> {moderationResult.is_safe ? "✅ Yes" : "❌ No"}
                </Typography>

                {!moderationResult.is_safe && (
                  <>
                    <Typography variant="subtitle1" sx={{ mt: 2 }}>
                      Issues Detected:
                    </Typography>
                    <List dense>
                      {moderationResult.issues_detected.map((issue, index) => (
                        <ListItem key={index} alignItems="flex-start">
                          <ListItemText
                            primary={`Rule ${issue.rule}: ${issue.description}`}
                            secondary={`Suggestion: ${issue.suggestion}`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </>
                )}

                <Typography variant="h6" sx={{ mt: 2 }}>
                  Rephrased Version:
                </Typography>
                <Typography sx={{ whiteSpace: "pre-wrap" }}>
                  
                  <span ref={resultVal}>{moderationResult.rephrased_safe_version}</span>
                  <Tooltip title={isCopied?"Copied":"Click To Copy"}>
                  <ContentCopyIcon fontSize="small" color="primary" sx={{ml:"3px",lineHeight:30}} 
                  onClick={handleCopy}/></Tooltip>
                </Typography>
              </>
            )}
            
          </Box>
        )}
        
        
    </Container>
    <Divider sx={{mb:2,mt:2}}/>
    <Typography sx={{mb:2}} variant="h6" align="center" fontWeight="bold" color="#666">
        
          A product by <a href="https://mgiep.unesco.org">UNESCO MGIEP</a>
        </Typography>
        {/* <Box
          component="img"
          src={unmglogo}
          alt="UNESCO MGIEP"
          sx={{
            width: 80,
            mx:"auto",
            height: 'auto',
            mb: 2
          }}
        /> */}
    <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          The text will be analyzed for:
          <ol>
          <li>Abusive language  </li>
          <li>Hate speech (race, religion, community)  </li>
          <li>Gender bias  </li>
          <li>Discrimination (gender, sex, identity)  </li>
          <li>Provocative tone  </li>
          <li>Taboo words</li>
          </ol>
          </DialogContentText>
        </DialogContent>
        
      </Dialog>
  </div>
  </>
    
  );
};

export default App; 