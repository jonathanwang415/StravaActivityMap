'use client';

import React, { useRef, useEffect, useState } from 'react';
import ActivityMap from '../../components/ActivityMap';
import { useAuth } from '@/contexts/AuthContext';
import { useLoading } from '@/contexts/LoadingContext';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Activity } from '@/types/Activity';
import { Spinner, Box, Card, Avatar, Table, Heading, Text, Flex, Button, Container } from '@radix-ui/themes';

export default function HomePage() {
    const router = useRouter();
    const { token, setToken, logout } = useAuth();
    const { isLoading, setLoading, loadingMessage } = useLoading();

    const [activities, setActivities] = useState<any[]>([]);
    const [totalMileage, setTotalMileage] = useState<number>(0);
    const [totalCyclingPower, setTotalCyclingPower] = useState<number>(0);
    const [aiInsights, setAiInsights] = useState<string>('');

    const hasFetched = useRef(false);

    const fetchAiInsights = async (mileage: number, power: number) => {
        axios.post('/api/openai', { mileage, power })
            .then(openAIResponse => {
                if (openAIResponse.status !== 200) {
                    console.error('Error fetching AI insights:', openAIResponse.statusText);
                }

                const insight = openAIResponse.data;
                console.log('AI response:', insight);

                setAiInsights(insight.result);
            })
            .catch(error => {
                console.error('Error fetching AI insights:', error);
            });
    };  

    useEffect(() => {
        if (!token){    
            console.log('No token found, skipping API call');
            setTimeout(() => {
                router.push('/login');
            }, 0);
            return;
        }

        if (activities && aiInsights) {
            return; // Skip if activities and insights are already set
        }

        if (hasFetched.current) {
            return;
        }

        hasFetched.current = true;

        console.log('Fetching activities with token:', token);

        setLoading(true);

        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params : {
                per_page: 200
            }
        };

        axios.get('https://www.strava.com/api/v3/athlete/activities', config)
            .then(stravaResponse => {
                if (stravaResponse.status !== 200) {
                    if (stravaResponse.status === 401) {
                        console.error('Unauthorized: Token is invalid or expired. Redirecting for re-authorization.');
                        logout();
                        const router = useRouter();
                        router.push('/login');
                    }
                } else {
                    const stravaActivities: Activity [] = stravaResponse.data;
                    console.log('Activities fetched successfully:', stravaActivities);

                    let mileage = stravaActivities.reduce((total, activity) => {
                        if (!activity.distance) {
                            return total; // Skip if distance is not available
                        }
                
                        return total + activity.distance * 3.28084 / 5280; // Convert meters to miles
                    }, 0);

                    mileage = Math.trunc(mileage);
                
                    let power = stravaActivities.reduce((total, activity) => {
                        if (!activity.kilojoules || !activity.sport_type || activity.sport_type !== "Ride") {
                            return total; // Skip if distance is not available
                        }
                
                        return total + activity.kilojoules; // Convert meters to miles
                    }, 0);

                    power = Math.trunc(power);

                    console.log('totalMileage:', mileage);
                    console.log('totalCyclingPower:', power);

                    axios.post('/api/openai', { mileage, power })
                        .then(openAIResponse => {
                            if (openAIResponse.status !== 200) {
                                console.error('Error fetching AI insights:', openAIResponse.statusText);
                            }

                            const insight = openAIResponse.data;
                            console.log('AI response:', insight);

                            setActivities(stravaActivities);
                            setTotalMileage(mileage);
                            setTotalCyclingPower(power);
                            setLoading(false);
                            setAiInsights(insight.result);
                        })
                        .catch(error => {
                            console.error('Error fetching AI insights:', error);
                        });
                }
            })
            .catch(error => {
                console.error('Error fetching activities:', error);
                if (error.response && error.response.status === 401) {
                    console.error('Unauthorized: Token is invalid or expired. Redirecting for re-authorization.');
                    const router = useRouter();
                    router.push('/login');
                }
            });
    }, [token, activities, aiInsights]);

    const loadingComponent = (
        <Flex direction="row" gap="5" mt="4">
            <Spinner />
            <Heading size="4">
                {loadingMessage}
            </Heading>
        </Flex>
    );        

    if (isLoading) {
        return loadingComponent;
    }

    return (
        <Flex direction="column" gap="5" mt="4">
            <Heading size="5" align="center">
                Strava Activity Summary
            </Heading>

            <Table.Root variant="surface">
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeaderCell>Number Activities</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Total Mileage</Table.ColumnHeaderCell>
                        {totalCyclingPower > 0 ? <Table.ColumnHeaderCell>Total Power Outputted</Table.ColumnHeaderCell> : null}
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    <Table.Row>
                        <Table.Cell>{activities.length}</Table.Cell>
                        <Table.Cell>{totalMileage.toFixed(0)} miles</Table.Cell>

                        {totalCyclingPower > 0 ? <Table.Cell> {totalCyclingPower.toFixed(0)} kJ </Table.Cell> : null}
                    </Table.Row>
                </Table.Body>
            </Table.Root>

            <Box maxWidth="75%">
                <Card>
                    <Flex gap="3" align="center">
                        <Avatar
                            size="3"
                            src="/images/ai.png"
                            radius="full"
                            fallback="T"
                            title="Artificial intelligence icons created by RIkas Dzihab - Flaticon"
                        />
                        <Box>
                            <Text as="div" size="2" weight="bold">
                                AI Insights
                            </Text>
                            <Text as="div" size="2" color="gray" white-space="pre-line">
                                {aiInsights}
                            </Text>
                        </Box>
                    </Flex>
                    <Button variant="soft" size="2" mt="4" mb="4" onClick={() => fetchAiInsights(totalMileage, totalCyclingPower)}>
                        <Avatar
                            size="1"
                            src="/images/ai.png"
                            radius="full"
                            fallback="T"
                            title="Artificial intelligence icons created by RIkas Dzihab - Flaticon"
                        />
                        Regenerate
                    </Button>
                </Card>
            </Box>
            
            <ActivityMap activities={activities} />

            <Button variant="soft" size="2" mt="4" mb="4" onClick={logout}>
                Log Out
            </Button>
        </Flex>
    );
}