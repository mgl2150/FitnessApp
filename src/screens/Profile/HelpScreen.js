import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Card,
  CardBody,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Icon,
  Badge,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
} from '@chakra-ui/react';
import { 
  FaQuestionCircle, 
  FaSearch, 
  FaDumbbell, 
  FaFire, 
  FaUsers, 
  FaCog,
  FaChartLine,
  FaHeart
} from 'react-icons/fa';
import AppContainer from '../../components/Layout/AppContainer';
import { ArrowBackIcon, IconButton } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';

const HelpScreen = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const handleBackNavigation = () => {
    navigate(-1);
  };

  const faqCategories = [
    {
      title: 'Getting Started',
      icon: FaHeart,
      color: 'green',
      faqs: [
        {
          question: 'How do I create an account?',
          answer: 'To create an account, tap the "Sign Up" button on the login screen. Fill in your email, create a password, and provide your basic information like name and fitness goals. You\'ll receive a confirmation email to verify your account.'
        },
        {
          question: 'How do I set up my fitness profile?',
          answer: 'After creating your account, go to your Profile tab and tap "Edit Profile". Here you can set your fitness goals, current fitness level, preferred workout types, and daily calorie burn targets.'
        },
        {
          question: 'What information do I need to provide?',
          answer: 'We only require basic information: your name, email, and fitness goals. Optional information like age, weight, and height can help us provide more personalized workout recommendations.'
        }
      ]
    },
    {
      title: 'Workouts & Exercises',
      icon: FaDumbbell,
      color: 'blue',
      faqs: [
        {
          question: 'How do I start a workout?',
          answer: 'Browse workouts on the Home screen or Workouts tab. Tap on any workout to view details, then tap "Start Workout" to begin. Follow the exercise instructions and use the timer for each exercise.'
        },
        {
          question: 'Can I create custom workouts?',
          answer: 'Yes! Go to the Workouts tab and tap "Create Workout". You can add exercises from our library, set durations, rest periods, and save your custom routine for future use.'
        },
        {
          question: 'How do I track my workout progress?',
          answer: 'During workouts, the app automatically tracks your time, exercises completed, and estimated calories burned. All data is saved to your progress history which you can view in the Progress tab.'
        },
        {
          question: 'What if I need to pause or stop a workout?',
          answer: 'You can pause any workout by tapping the pause button. To stop completely, tap the stop button. Your progress up to that point will be saved, and you can resume later if needed.'
        }
      ]
    },
    {
      title: 'Calorie Tracking',
      icon: FaFire,
      color: 'orange',
      faqs: [
        {
          question: 'How are calories calculated?',
          answer: 'Calories are estimated based on the type of exercise, duration, and your personal information (if provided). Our calculations use standard metabolic equivalent (MET) values for different activities.'
        },
        {
          question: 'How do I set my daily calorie goal?',
          answer: 'Go to the Progress tab and find the "Daily Calorie Goal" card. Tap "Adjust" to set your target. You can choose from preset goals (Light: 300, Moderate: 500, Active: 750, Intense: 1000) or set a custom amount.'
        },
        {
          question: 'Can I see my calorie history?',
          answer: 'Yes! The Progress tab shows your daily calorie burn, weekly trends, and historical data. You can view your streak, achievements, and progress toward your goals.'
        },
        {
          question: 'What counts toward my daily calorie goal?',
          answer: 'All completed workouts and exercises tracked through the app count toward your daily calorie goal. Manual activities are not currently supported but may be added in future updates.'
        }
      ]
    },
    {
      title: 'Progress & Achievements',
      icon: FaChartLine,
      color: 'purple',
      faqs: [
        {
          question: 'How do I view my progress?',
          answer: 'The Progress tab shows comprehensive statistics including daily calorie burn, weekly charts, workout history, current streaks, and achievements you\'ve unlocked.'
        },
        {
          question: 'What are achievements and how do I earn them?',
          answer: 'Achievements are milestones that recognize your fitness progress. Examples include "First Goal Reached", "3-Day Streak", "Week Warrior", and "Calorie Crusher". They unlock automatically as you reach specific targets.'
        },
        {
          question: 'How do streaks work?',
          answer: 'Streaks count consecutive days where you meet your daily calorie goal. Your current streak and best streak are displayed in the Progress tab. Missing a day will reset your current streak.'
        },
        {
          question: 'Can I export my progress data?',
          answer: 'Data export features are planned for future updates. Currently, you can view all your progress within the app\'s Progress tab.'
        }
      ]
    },
    {
      title: 'Community & Social',
      icon: FaUsers,
      color: 'teal',
      faqs: [
        {
          question: 'How do I share my progress?',
          answer: 'Go to the Community tab to share workout achievements, progress photos, or motivational posts. You can also comment on and like other users\' posts.'
        },
        {
          question: 'Is my information private?',
          answer: 'Yes, your personal information and detailed progress data are private. Only the content you choose to share in the Community tab is visible to other users.'
        },
        {
          question: 'How do I report inappropriate content?',
          answer: 'If you see inappropriate content in the Community tab, tap the three dots on the post and select "Report". Our team reviews all reports promptly.'
        },
        {
          question: 'Can I follow other users?',
          answer: 'Following features are planned for future updates. Currently, you can interact with the community through posts, likes, and comments.'
        }
      ]
    },
    {
      title: 'Settings & Account',
      icon: FaCog,
      color: 'gray',
      faqs: [
        {
          question: 'How do I change my password?',
          answer: 'Go to Profile > Settings > Account Settings. Tap "Change Password" and follow the prompts to update your password securely.'
        },
        {
          question: 'How do I update my fitness goals?',
          answer: 'In your Profile tab, tap "Edit Profile" to update your fitness goals, target weight, preferred workout types, and other preferences.'
        },
        {
          question: 'Can I delete my account?',
          answer: 'Yes, you can delete your account in Profile > Settings > Account Settings > Delete Account. This action is permanent and cannot be undone.'
        },
        {
          question: 'How do I contact support?',
          answer: 'For additional help, go to Profile > Settings > Contact Support, or email us directly at support@fitnessapp.com. We typically respond within 24 hours.'
        }
      ]
    }
  ];

  const filteredFAQs = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(
      faq =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0);

  return (
    <AppContainer>
      <VStack spacing={6} align="stretch" p={4}>
      <HStack justify="space-between" align="center">
                <IconButton
                  icon={<ArrowBackIcon />}
                  variant="ghost"
                  size="md"
                  onClick={handleBackNavigation}
                  aria-label="Go back"
                  color={'white'}
                />
                <Text fontSize="lg" fontWeight="bold" color={'white'} noOfLines={1}>
                 Help & Support
                </Text>
                <Box w="32px" />
              </HStack>
        {/* Search */}
        <Card bg="gray.800" borderRadius="xl">
          <CardBody p={4}>
            <InputGroup>
              <InputLeftElement>
                <Icon as={FaSearch} color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Search FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                bg="gray.700"
                border="none"
                color="white"
                _placeholder={{ color: 'gray.400' }}
                _focus={{ bg: 'gray.600', boxShadow: 'none' }}
              />
            </InputGroup>
          </CardBody>
        </Card>

        {/* Quick Stats */}
        <SimpleGrid columns={3} spacing={4}>
          <Card bg="gray.800" borderRadius="xl" textAlign="center">
            <CardBody p={4}>
              <Text fontSize="2xl" fontWeight="bold" color="primary.400">
                {faqCategories.reduce((total, cat) => total + cat.faqs.length, 0)}
              </Text>
              <Text fontSize="sm" color="gray.400">
                Total FAQs
              </Text>
            </CardBody>
          </Card>
          <Card bg="gray.800" borderRadius="xl" textAlign="center">
            <CardBody p={4}>
              <Text fontSize="2xl" fontWeight="bold" color="secondary.400">
                {faqCategories.length}
              </Text>
              <Text fontSize="sm" color="gray.400">
                Categories
              </Text>
            </CardBody>
          </Card>
          <Card bg="gray.800" borderRadius="xl" textAlign="center">
            <CardBody p={4}>
              <Text fontSize="2xl" fontWeight="bold" color="green.400">
                24h
              </Text>
              <Text fontSize="sm" color="gray.400">
                Support Response
              </Text>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* FAQ Categories */}
        <VStack spacing={6} align="stretch">
          {filteredFAQs.map((category, categoryIndex) => (
            <Card key={categoryIndex} bg="gray.800" borderRadius="xl">
              <CardBody p={6}>
                <HStack spacing={3} mb={4}>
                  <Icon as={category.icon} color={`${category.color}.400`} boxSize={6} />
                  <Text fontSize="xl" fontWeight="bold" color="white">
                    {category.title}
                  </Text>
                  <Badge colorScheme={category.color} borderRadius="full">
                    {category.faqs.length} FAQs
                  </Badge>
                </HStack>

                <Accordion allowMultiple>
                  {category.faqs.map((faq, faqIndex) => (
                    <AccordionItem key={faqIndex} border="none">
                      <AccordionButton
                        p={4}
                        bg="gray.700"
                        borderRadius="lg"
                        mb={2}
                        _hover={{ bg: 'gray.600' }}
                        _expanded={{ bg: 'gray.600' }}
                      >
                        <Box flex="1" textAlign="left">
                          <Text fontWeight="semibold" color="white">
                            {faq.question}
                          </Text>
                        </Box>
                        <AccordionIcon color="gray.400" />
                      </AccordionButton>
                      <AccordionPanel pb={4} px={4}>
                        <Text color="gray.300" lineHeight="1.6">
                          {faq.answer}
                        </Text>
                      </AccordionPanel>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardBody>
            </Card>
          ))}
        </VStack>

        {/* No Results */}
        {searchTerm && filteredFAQs.length === 0 && (
          <Card bg="gray.800" borderRadius="xl">
            <CardBody p={8} textAlign="center">
              <Icon as={FaSearch} boxSize={8} color="gray.400" mb={4} />
              <Text fontSize="lg" fontWeight="semibold" color="white" mb={2}>
                No results found
              </Text>
              <Text color="gray.400">
                Try searching with different keywords or browse the categories above
              </Text>
            </CardBody>
          </Card>
        )}
      </VStack>
    </AppContainer>
  );
};

export default HelpScreen;
