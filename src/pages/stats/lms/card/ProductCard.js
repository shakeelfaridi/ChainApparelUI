// REACT CORE
import { useState } from 'react';
import PropTypes from 'prop-types';

// ICONS
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IconButton from '@mui/material/IconButton';

// STATS
import { StatCard } from '../../lms';

// UTILS
import { LmsSingletotals, LmsMapRoute } from '../../../../helpers';

// MUI
import {
    Card,
    Grid,
    Typography,
    Link,
    Collapse,
    CardActions,
    CardContent,
    Stack,
} from '@mui/material';

import { styled } from '@mui/material/styles';


ProductCard.propTypes = {
    recordid: PropTypes.string,
    locid: PropTypes.string,
    products: PropTypes.object,
    dense: PropTypes.bool,
};

export default function ProductCard({recordid, locid, products, dense}){

    const ExpandMore = styled((props) => {
        const { expand, ...other } = props;
        return <IconButton {...other} />;
      })(({ theme, expand }) => ({
        transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
          duration: theme.transitions.duration.shortest,
        }),
    }));

    const [expanded, setExpanded] = useState(true);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    return (
        <>
            <Card sx={{
                marginTop: '24px',
                backgroundColor: '#f8f8f8',
            }}>
                <CardActions disableSpacing>
                    <Stack 
                        direction="row"
                        justifyContent="space-around"
                        alignItems="baseline"
                        onClick={handleExpandClick} 
                        sx={{
                        cursor: 'pointer',
                        width: '100%',
                    }}>
                        <Typography 
                            sx={{
                                padding: '10px',
                                fontSize: '18px',
                                fontWeight: 'bold',
                                color: 'black',
                            }}>
                            Reports per product
                        </Typography>
                        <ExpandMore
                            expand={expanded}
                            aria-expanded={expanded}
                            aria-label="show more"
                        >
                            <ExpandMoreIcon />
                        </ExpandMore>
                    </Stack>
                </CardActions>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent>

                        {products.length > 0 && products.map((product) => (
                        <>
                            <Typography variant="h5" component="h3" paragraph >
                                <Link href={LmsMapRoute(recordid, locid, product.targetGroup, product.id)}
                                sx={{
                                    fontSize: '16px',
                                }}>
                                    {product.title}
                                </Link>
                            </Typography>

                            <Grid container spacing={(dense ? 1 : 3)}>

                                <Grid item xs={12} md={(dense ? 1.2 : 2.4)}>
                                    <StatCard dense={dense}
                                        title="Students"
                                        total={product.stud ? product.stud : 0}
                                        goto="#"
                                    />
                                </Grid>

                                <Grid item xs={12} md={(dense ? 1.2 : 2.4)}>
                                    <StatCard dense={dense}
                                        title="Students Logged In"
                                        total={product.studLoggedIn ? product.studLoggedIn : 0}
                                        goto="#"
                                    />
                                </Grid>

                                <Grid item xs={12} md={(dense ? 1.2 : 2.4)}>
                                    <StatCard dense={dense}
                                        title="Active Students"
                                        total={product.activeStud ? product.activeStud : 0}
                                        goto="#"
                                    />
                                </Grid>

                                <Grid item xs={12} md={(dense ? 1.2 : 2.4)}>
                                    <StatCard dense={dense}
                                        title="% Active"
                                        total={LmsSingletotals(product.stud, product.activeStud, 'totals', 'round','','')}
                                        type="%"
                                    />
                                </Grid>

                                <Grid item xs={12} md={(dense ? 1.2 : 2.4)}>
                                    <StatCard dense={dense}
                                        title="Total Courses Finished"
                                        total={product.totFinished ? product.totFinished : 0}
                                        goto="#"
                                    />
                                </Grid>

                                <Grid item xs={12} md={(dense ? 1.2 : 2.4)}>
                                    <StatCard dense={dense}
                                        title="Avg. Courses Per Student"
                                        total={LmsSingletotals(product.totFinished, product.stud, 'average', 'decimals')}
                                    />
                                </Grid>

                                <Grid item xs={12} md={(dense ? 1.2 : 2.4)}>
                                    <StatCard dense={dense}
                                        title="Avg. Courses Per Active Student"
                                        total={LmsSingletotals(product.totFinished, product.activeStud, 'average', 'decimals')}
                                    />
                                </Grid>

                                <Grid item xs={12} md={(dense ? 1.2 : 2.4)}>
                                    <StatCard dense={dense}
                                        title="Points"
                                        total={product.points ? product.points : 0}
                                        goto="#"
                                    />
                                </Grid>

                                <Grid item xs={12} md={(dense ? 1.2 : 2.4)}>
                                    <StatCard dense={dense}
                                        title="Avg. Points Per Student"
                                        total={LmsSingletotals(product.points, product.stud, 'average', 'decimals')}
                                    />
                                </Grid>

                                <Grid item xs={12} md={(dense ? 1.2 : 2.4)}>
                                    <StatCard dense={dense}
                                        title="Avg. Points Per Active Student"
                                        total={LmsSingletotals(product.points, product.activeStud, 'average', 'decimals')}
                                    />
                                </Grid>

                            </Grid>
                            </>
                        ))}

                    </CardContent>
                </Collapse>
            </Card>
        </>
    )
}