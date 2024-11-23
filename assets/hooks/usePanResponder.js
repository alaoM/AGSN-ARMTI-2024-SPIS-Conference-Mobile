import { useState } from 'react';
import { Animated, PanResponder } from 'react-native';

export const usePanResponder = (onSwipeDown) => {
    const [pan] = useState(new Animated.ValueXY());

    const panResponder = PanResponder.create({
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: Animated.event([null, { dy: pan.y }], { useNativeDriver: false }),
        onPanResponderRelease: (e, gestureState) => {
            if (gestureState.dy > 100) {
                onSwipeDown();
            } else {
                Animated.spring(pan, {
                    toValue: { x: 0, y: 0 },
                    useNativeDriver: false,
                }).start();
            }
        },
    });

    return { pan, panResponder };
};
