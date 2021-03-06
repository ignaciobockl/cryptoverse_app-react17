import React, { useEffect, useState } from 'react';
import HTMLReactParser from 'html-react-parser';
import { useParams } from 'react-router-dom';
import millify from 'millify';
import { Col, Row, Typography, Select } from 'antd';
import { 
    MoneyCollectOutlined, 
    DollarCircleOutlined, 
    FundOutlined, 
    ExclamationCircleOutlined, 
    StopOutlined, 
    TrophyOutlined, 
    NumberOutlined, 
    ThunderboltOutlined, 
    CheckOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';

import { getCrypto, getHistoryPriceCrypto } from '../actions/crypto';

import LineChart from './LineChart';


const { Title, Text } = Typography;
const { Option } = Select;

let stats, genericStats = [{}];

const CryptoDetails = () => {

    const { coinId } = useParams();

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch( getCrypto( coinId ) );
    }, [ coinId ]);
    
    const { coinSelected, coinHistoryPrice } = useSelector( state => state.crypto );
    const { data, status } = coinSelected;

    const [ timePeriod, setTimePeriod ] = useState('7d');

    useEffect(() => {
        dispatch( getHistoryPriceCrypto( coinId, timePeriod ) );
    }, [ timePeriod ])
    

    let cryptoDetails = data?.coin || 'data.coin';

    const time = ['3h', '24h', '7d', '30d', '3m', '1y', '3y', '5y'];

    if ( typeof(cryptoDetails) !== 'string' ) {

        cryptoDetails = data?.coin;

        stats = [
            { title: 'Price to USD', value: `$ ${cryptoDetails.price && millify(cryptoDetails.price)} `, icon: <DollarCircleOutlined /> },
            { title: 'Rank', value: cryptoDetails.rank, icon: <NumberOutlined /> },
            { title: '24h Volume', value: `$ ${cryptoDetails["24hVolume"] ? millify(cryptoDetails["24hVolume"]) : 'no data'}`, icon: <ThunderboltOutlined /> },
            { title: 'Market Cap', value: `$ ${cryptoDetails.marketCap && millify(cryptoDetails.marketCap)}`, icon: <DollarCircleOutlined /> },
            { title: 'All-time-high(daily avg.)', value: `$ ${millify(cryptoDetails.allTimeHigh.price)}`, icon: <TrophyOutlined /> },
        ];

        if ( cryptoDetails.supply.total === null ) { cryptoDetails.supply.total = 0 }

        genericStats = [
            { title: 'Number Of Markets', value: cryptoDetails.numberOfMarkets, icon: <FundOutlined /> },
            { title: 'Number Of Exchanges', value: cryptoDetails.numberOfExchanges, icon: <MoneyCollectOutlined /> },
            { title: 'Aprroved Supply', value: cryptoDetails.approvedSupply ? <CheckOutlined /> : <StopOutlined />, icon: <ExclamationCircleOutlined /> },
            { title: 'Total Supply', value: `$ ${millify(cryptoDetails.supply.total)} `, icon: <ExclamationCircleOutlined /> },
            { title: 'Circulating Supply', value: `$ ${millify(cryptoDetails.supply.circulating) || 0}`, icon: <ExclamationCircleOutlined /> },
        ];

    }

    return (
        <Col className='coin-detail-container'>

            <Col className='coin-heading-container'>
                <Title level={ 2 } className='coin-name'>
                    { cryptoDetails.name } ({ cryptoDetails.name }-{ cryptoDetails.symbol }) Price
                </Title>
                <p>
                    { cryptoDetails.name } live price in US dollars.
                    View value statics, market cap and supply.
                </p>
            </Col>

            <Select 
                className='select-timeperiod' 
                defaultValue={ timePeriod } 
                onChange={(value) => setTimePeriod(value)}
                placeholder='Select Time Period' 
            >
                {
                    time.map((date) => 
                        <Option key={ date }>
                            { date }
                        </Option>
                    )
                }
            </Select>

            <LineChart 
                coinHistory={ coinHistoryPrice } 
                currentPrice={ cryptoDetails?.price !== undefined ? millify(cryptoDetails.price) : 0 }
                coinName={ cryptoDetails.name }
            />

            <Col className='stats-container'>

                <Col className='coin-value-statistics'>
                    
                    <Col className='coin-value=statistics-heading'>
                        <Title level={ 3 } className='coin-detailes-heading'>
                            { cryptoDetails.name } Value Statistics
                        </Title>
                        <p>
                            An overview showing the stats of { cryptoDetails.name }
                        </p>
                    </Col>
                    
                    {
                        stats !== undefined 
                            ?
                                stats.map(({ icon, title, value }, index) => (
                                    <Col className='coin-stats' key={ index }>
                                        <Col className='coin-stats-name'>
                                            <Text>{ icon }</Text>
                                            <Text>{ title }</Text>
                                        </Col>
                                        <Text className='stats'>{ value }</Text>
                                    </Col>
                                ))
                            :
                                'Loading...'
                    }                   

                </Col>

                <Col className='other-stats-info'>
                    
                    <Col className='coin-value=statistics-heading'>
                        <Title level={ 3 } className='coin-detailes-heading'>
                            Other Statistics
                        </Title>
                        <p>
                            An overview showing the stats of all cryptocurrencies
                        </p>
                    </Col>
                    
                    {
                        genericStats !== undefined 
                            ?
                                genericStats.map(({ icon, title, value }, index) => (
                                    <Col className='coin-stats' key={ index }>
                                        <Col className='coin-stats-name'>
                                            <Text>{ icon }</Text>
                                            <Text>{ title }</Text>
                                        </Col>
                                        <Text className='stats'>{ value }</Text>
                                    </Col>
                                ))
                            :
                                'Loading...'
                    }                   

                </Col>

            </Col>

            <Col className='coin-desc-link'>
                <Row className='coin-desc'>
                    <Title level={ 3 } className='coin-details-heading'>
                        What is { cryptoDetails.name }
                        {
                            cryptoDetails.description !== undefined &&
                            HTMLReactParser( cryptoDetails.description.toString() )
                        }
                    </Title>
                </Row>
                <Col className='coin-links'>
                    <Title level={ 3 } className='coin-details-heading'>
                        { cryptoDetails.name } Links
                    </Title>
                    {
                        cryptoDetails?.links !== undefined
                        ?
                            cryptoDetails.links.map((link) => (
                                <Row className='coin-link' key={ link.name }>
                                    <Title level={ 5 } className='link-name'>
                                        { link.type }
                                    </Title>
                                    <a href={ link.url } target='_blank' rel='noreferrer'>
                                        { link.name }
                                    </a>
                                </Row>
                            ))
                        :
                                'Loading...'
                    }
                </Col>
            </Col>

        </Col>
    )
}


export default CryptoDetails;