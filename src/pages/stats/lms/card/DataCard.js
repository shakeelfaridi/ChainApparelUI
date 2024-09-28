// REACT
import PropTypes from 'prop-types';

// STATS
import { StatCard, ProductCard } from '../../lms';

// HELPERS
import { LmsSingletotals, LmsSumProductTotals, LmsSumLocationTotals, LmsMapRoute } from '../../../../helpers';

// MUI
import {
    Card,
    Grid,
    Typography,
    Divider,
    Link,
} from '@mui/material';

DataCard.propTypes = {
    recordid: PropTypes.string,
    data: PropTypes.object,
    dense: PropTypes.bool,
    showProducts: PropTypes.bool,
    isTotals: PropTypes.bool,
};

export default function DataCard({recordid, data, dense, showProducts, isTotals}){

    const bgColor           = isTotals ? '#ccc' : '';
    const id                = recordid;
    const locid             = data.id;
    const products          = data.products;

    return (
        <>
            <Card sx={{
                padding: '20px',
                marginTop: '24px',
                backgroundColor: {bgColor},
            }}>

                <Typography variant="h5" component="h3" paragraph>
                    {isTotals ? 
                        <>
                            Totals
                        </>
                    :   <Link href={LmsMapRoute(id, locid)}>
                            {data.name}
                        </Link> 
                    }
                </Typography>

                <Grid container spacing={(dense ? 1 : 3)}>

                    <Grid item xs={12} md={(dense ? 1.2 : 2.4)}>
                        <StatCard dense={dense}
                            title="Students"
                            total={!isTotals && products.length > 0 ? 
                                LmsSumProductTotals(products, 'stud', 'totals', 'round'): 
                                (
                                    data.length > 0 ?
                                        LmsSumLocationTotals(data, 'stud', 'totals', 'round')
                                    : 0
                                )}
                            goto="#"
                        />
                    </Grid>

                    <Grid item xs={12} md={(dense ? 1.2 : 2.4)}>
                        <StatCard dense={dense}
                            title="Students Logged In"
                            total={!isTotals && products.length > 0 ? 
                                LmsSumProductTotals(products, 'studLoggedIn', 'totals', 'round'): 
                                (
                                    data.length > 0 ?
                                        LmsSumLocationTotals(data, 'studLoggedIn', 'totals', 'round')
                                    : 0
                                )}
                            goto="#"
                        />
                    </Grid>

                    <Grid item xs={12} md={(dense ? 1.2 : 2.4)}>
                        <StatCard dense={dense}
                            title="Active Students"
                            total={!isTotals && products.length > 0 ? 
                                LmsSumProductTotals(products, 'activeStud', 'totals', 'round'): 
                                (
                                    data.length > 0 ?
                                        LmsSumLocationTotals(data, 'activeStud', 'totals', 'round')
                                    : 0
                                )}
                            goto="#"
                        />
                    </Grid>

                    <Grid item xs={12} md={(dense ? 1.2 : 2.4)}>
                        <StatCard dense={dense}
                            title="% Active"
                            total={!isTotals && products.length > 0 ? 
                                LmsSingletotals
                                (
                                  LmsSumProductTotals(products, 'stud', 'totals', 'round'), 
                                  LmsSumProductTotals(products, 'activeStud', 'totals', 'round'),
                                  'totals', 
                                  'round',
                                  '',
                                  ''
                                ): (
                                    data.length > 0 ?
                                        LmsSingletotals
                                        (
                                        LmsSumLocationTotals(data, 'stud', 'totals', 'round'), 
                                        LmsSumLocationTotals(data, 'activeStud', 'totals', 'round'),
                                        'totals', 
                                        'round',
                                        '',
                                        ''
                                        )
                                    : 0
                                )}
                            type="%"
                        />
                    </Grid>

                    <Grid item xs={12} md={(dense ? 1.2 : 2.4)}>
                        <StatCard dense={dense}
                            title="Total Courses Finished"
                            total={!isTotals && products.length > 0 ? 
                                LmsSumProductTotals(products, 'totFinished', 'totals', 'round'): 
                                (
                                    data.length > 0 ?
                                        LmsSumLocationTotals(data, 'totFinished', 'totals', 'round')
                                    : 0
                                )}
                            goto="#"
                        />
                    </Grid>

                    <Grid item xs={12} md={(dense ? 1.2 : 2.4)}>
                        <StatCard dense={dense}
                            title="Avg. Courses Per Student"
                            total={!isTotals && products.length > 0 ? 
                                LmsSingletotals
                                (
                                  LmsSumProductTotals(products, 'totFinished', 'totals', 'round'), 
                                  LmsSumProductTotals(products, 'stud', 'totals', 'round'),
                                  'average', 
                                  'decimals',
                                )
                                : 
                                (
                                    data.length > 0 ?
                                        LmsSingletotals
                                        (
                                        LmsSumLocationTotals(data, 'totFinished', 'totals', 'round'), 
                                        LmsSumLocationTotals(data, 'stud', 'totals', 'round'),
                                        'totals', 
                                        'round',
                                        '',
                                        ''
                                        )
                                    : 0
                                )
                            }
                        />
                    </Grid>

                    <Grid item xs={12} md={(dense ? 1.2 : 2.4)}>
                        <StatCard dense={dense}
                            title="Avg. Courses Per Active Student"
                            total={!isTotals && products.length > 0 ? 
                                LmsSingletotals
                                (
                                  LmsSumProductTotals(products, 'totFinished', 'totals', 'round'), 
                                  LmsSumProductTotals(products, 'activeStud', 'totals', 'round'),
                                  'average', 
                                  'decimals',
                                )
                                : 
                                (
                                    data.length > 0 ?
                                        LmsSingletotals
                                        (
                                        LmsSumLocationTotals(data, 'totFinished', 'totals', 'round'), 
                                        LmsSumLocationTotals(data, 'activeStud', 'totals', 'round'),
                                        'totals', 
                                        'round',
                                        '',
                                        ''
                                        )
                                    : 0
                                )
                            }
                        />
                    </Grid>

                    <Grid item xs={12} md={(dense ? 1.2 : 2.4)}>
                        <StatCard dense={dense}
                            title="Points"
                            total={!isTotals && products.length > 0 ? 
                                LmsSumProductTotals(products, 'points', 'totals', 'round'): 
                                (
                                    data.length > 0 ?
                                        LmsSumLocationTotals(data, 'points', 'totals', 'round')
                                    : 0
                                )}
                            goto="#"
                        />
                    </Grid>

                    <Grid item xs={12} md={(dense ? 1.2 : 2.4)}>
                        <StatCard dense={dense}
                            title="Avg. Points Per Student"
                            total={!isTotals && products.length > 0 ? 
                                LmsSingletotals
                                (
                                  LmsSumProductTotals(products, 'points', 'totals', 'round'), 
                                  LmsSumProductTotals(products, 'stud', 'totals', 'round'),
                                  'average', 
                                  'decimals',
                                )
                                : 
                                (
                                    data.length > 0 ?
                                        LmsSingletotals
                                        (
                                        LmsSumLocationTotals(data, 'points', 'totals', 'round'), 
                                        LmsSumLocationTotals(data, 'stud', 'totals', 'round'),
                                        'totals', 
                                        'round',
                                        '',
                                        ''
                                        )
                                    : 0
                                )
                            }
                        />
                    </Grid>

                    <Grid item xs={12} md={(dense ? 1.2 : 2.4)}>
                        <StatCard dense={dense}
                            title="Avg. Points Per Active Student"
                            total={!isTotals && products.length > 0 ? 
                                LmsSingletotals
                                (
                                  LmsSumProductTotals(products, 'points', 'totals', 'round'), 
                                  LmsSumProductTotals(products, 'activeStud', 'totals', 'round'),
                                  'average', 
                                  'decimals',
                                )
                                : 
                                (
                                    data.length > 0 ?
                                        LmsSingletotals
                                        (
                                        LmsSumLocationTotals(data, 'points', 'totals', 'round'), 
                                        LmsSumLocationTotals(data, 'activeStud', 'totals', 'round'),
                                        'totals', 
                                        'round',
                                        '',
                                        ''
                                        )
                                    : 0
                                )
                            }
                        />
                    </Grid>

                </Grid>

                {showProducts && (
                    <>
                        <Divider sx={{
                            marginTop: '24px',
                        }}/>
                        <ProductCard 
                            recordid={id} 
                            locid={locid} 
                            products={products} 
                            dense={dense}/>
                    </>
                )}
            </Card>
        </>
    )
}