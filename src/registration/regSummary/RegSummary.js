import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useStyles } from './RegSummaryStyle';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Card } from '@material-ui/core';



const RegSummary = (props) => {
    const classes = useStyles();
    console.log('Summary', props)


    return (
        <Box className={classes.container}>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    style={{ backgroundColor: '#c0c0c07a' }}
                >
                    <Typography>Accordion 1</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Card variant="outlined" style={{ height: '33vh' }}>

                    </Card>
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2a-content"
                    id="panel2a-header"
                    style={{ backgroundColor: '#c0c0c07a' }}
                >
                    <Typography>Accordion 2</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Card variant="outlined" style={{ height: '33vh' }}>

                    </Card>
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel3a-content"
                    id="panel3a-header"
                    style={{ backgroundColor: '#c0c0c07a' }}
                >
                    <Typography>Disabled Accordion</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Card variant="outlined" style={{ height: '33vh' }}>

                    </Card>
                </AccordionDetails>
            </Accordion>
        </Box>
    );
}

export default RegSummary