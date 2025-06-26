import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  IconButton,
  HStack,
  VStack,
  Text,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Spinner,
  Alert,
  AlertIcon,
  useToast,
} from '@chakra-ui/react';
import {
  PlayIcon,
  PauseIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon
} from '@heroicons/react/24/outline';

const VideoPlayer = ({
  src,
  poster,
  title,
  width = "100%",
  height = "200px",
  autoPlay = false,
  controls = true,
  muted = false,
  loop = false,
  onLoadStart,
  onLoadedData,
  onError,
  onPlay,
  onPause,
  onEnded,
  className = "",
  ...props
}) => {
  const videoRef = useRef(null);
  const toast = useToast();

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(muted);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadStart = () => {
      setIsLoading(true);
      setHasError(false);
      onLoadStart?.();
    };

    const handleLoadedData = () => {
      setIsLoading(false);
      setDuration(video.duration);
      onLoadedData?.();
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handlePlay = () => {
      setIsPlaying(true);
      onPlay?.();
    };

    const handlePause = () => {
      setIsPlaying(false);
      onPause?.();
    };

    const handleEnded = () => {
      setIsPlaying(false);
      onEnded?.();
    };

    const handleError = (e) => {
      setIsLoading(false);
      setHasError(true);
      console.error('Video error:', e);
      onError?.(e);
      toast({
        title: "Video Error",
        description: "Failed to load video. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    };

    const handleVolumeChange = () => {
      setVolume(video.volume);
      setIsMuted(video.muted);
    };

    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('error', handleError);
    video.addEventListener('volumechange', handleVolumeChange);

    return () => {
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('error', handleError);
      video.removeEventListener('volumechange', handleVolumeChange);
    };
  }, [onLoadStart, onLoadedData, onPlay, onPause, onEnded, onError, toast]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play().catch(console.error);
    }
  };

  const handleSeek = (value) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = value;
    setCurrentTime(value);
  };

  const handleVolumeChange = (value) => {
    const video = videoRef.current;
    if (!video) return;

    video.volume = value;
    setVolume(value);
    setIsMuted(value === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    if (!isFullscreen) {
      if (video.requestFullscreen) {
        video.requestFullscreen();
      } else if (video.webkitRequestFullscreen) {
        video.webkitRequestFullscreen();
      } else if (video.msRequestFullscreen) {
        video.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (hasError) {
    return (
      <Box width={width} height={height} bg="gray.800" borderRadius="lg" overflow="hidden">
        <Alert status="error" bg="gray.700" color="white" height="100%" borderRadius="lg">
          <AlertIcon color="red.400" />
          <VStack align="start" spacing={1}>
            <Text fontSize="sm" fontWeight="semibold">Video unavailable</Text>
            <Text fontSize="xs" color="gray.400">Failed to load: {title || 'Exercise video'}</Text>
          </VStack>
        </Alert>
      </Box>
    );
  }

  return (
    <Box
      width={width}
      height={height}
      bg="black"
      borderRadius="lg"
      overflow="hidden"
      position="relative"
      className={className}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(true)}
      {...props}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        width="100%"
        height="100%"
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        playsInline
        style={{ objectFit: 'cover' }}
      />

      {isLoading && (
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          zIndex={2}
        >
          <Spinner size="lg" color="white" />
        </Box>
      )}

      {controls && showControls && !isLoading && (
        <Box
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          bg="blackAlpha.700"
          p={3}
          zIndex={3}
        >
          <VStack spacing={2}>
            {}
            <Box width="100%">
              <Slider
                value={currentTime}
                max={duration || 100}
                onChange={handleSeek}
                size="sm"
              >
                <SliderTrack bg="whiteAlpha.300">
                  <SliderFilledTrack bg="primary.500" />
                </SliderTrack>
                <SliderThumb boxSize={3} bg="primary.500" />
              </Slider>
            </Box>

            {}
            <HStack justify="space-between" width="100%">
              <HStack spacing={2}>
                <IconButton
                  icon={isPlaying ? <PauseIcon width="16px" /> : <PlayIcon width="16px" />}
                  onClick={togglePlay}
                  size="sm"
                  variant="ghost"
                  color="white"
                  _hover={{ bg: 'whiteAlpha.200' }}
                />

                <HStack spacing={1}>
                  <IconButton
                    icon={isMuted ? <SpeakerXMarkIcon width="16px" /> : <SpeakerWaveIcon width="16px" />}
                    onClick={toggleMute}
                    size="sm"
                    variant="ghost"
                    color="white"
                    _hover={{ bg: 'whiteAlpha.200' }}
                  />
                  <Box width="60px">
                    <Slider
                      value={isMuted ? 0 : volume}
                      max={1}
                      step={0.1}
                      onChange={handleVolumeChange}
                      size="sm"
                    >
                      <SliderTrack bg="whiteAlpha.300">
                        <SliderFilledTrack bg="white" />
                      </SliderTrack>
                      <SliderThumb boxSize={2} bg="white" />
                    </Slider>
                  </Box>
                </HStack>
              </HStack>

              <HStack spacing={2}>
                <Text fontSize="xs" color="white">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </Text>
                <IconButton
                  icon={isFullscreen ? <ArrowsPointingInIcon width="16px" /> : <ArrowsPointingOutIcon width="16px" />}
                  onClick={toggleFullscreen}
                  size="sm"
                  variant="ghost"
                  color="white"
                  _hover={{ bg: 'whiteAlpha.200' }}
                />
              </HStack>
            </HStack>
          </VStack>
        </Box>
      )}
    </Box>
  );
};

export default VideoPlayer;
