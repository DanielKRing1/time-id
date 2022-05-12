import React, { FC, useContext, useEffect, useMemo, useState } from 'react';
import { GestureResponderEvent, TouchableWithoutFeedback, View } from 'react-native';

type ClickListenerMap = Record<string, OnClickCallback>;
type OnClickCallback = (e: GestureResponderEvent) => any;
type ClickListenerContextType = {
    clickListeners: ClickListenerMap;
    addClickListener: (id: string, cb: OnClickCallback) => void;
    rmClickListener: (id: string) => void;
};
const DEFAULT_CONTEXT: ClickListenerContextType = {
  clickListeners: {},
  addClickListener: (id: string, cb: (e: GestureResponderEvent) => {}) => {},
  rmClickListener: (id: string) => {},
};
const ClickListenerContext = React.createContext<ClickListenerContextType>(DEFAULT_CONTEXT);

export const ClickListenerProvider: FC = (props) => {
    const { children } = props;

    const [clickListeners, setClickListeners] = useState<ClickListenerMap>({});

    const addClickListener = React.useCallback(
        (id, cb) => {
            setClickListeners((prevState) => {
                const nextState = { ...prevState };
                nextState[id] = cb;

                return nextState;
            });
        },
        [setClickListeners]
    );

    const rmClickListener = React.useCallback(
        (id) => {
            setClickListeners((prevState) => {
                const nextState = { ...prevState };
                delete nextState[id];

                return nextState;
            });
        },
        [setClickListeners]
    );

    const listenerCbs = useMemo(() => Object.values(clickListeners), [clickListeners]);
    const executeListenerCbs = React.useCallback(
        (e) => {
            for (let i = 0; i < listenerCbs.length; i++) {
                const cb = listenerCbs[i];
                cb(e);
            }
        },
        [listenerCbs, clickListeners]
    );

    return (
        <ClickListenerContext.Provider value={{ clickListeners, addClickListener, rmClickListener }}>
            <TouchableWithoutFeedback onPress={executeListenerCbs}>
                <View style={{ flex: 1, height: '100%', width: '100%' }}>{children}</View>
            </TouchableWithoutFeedback>
        </ClickListenerContext.Provider>
    );
};

export const useClickListener = () => {
    const context = useContext(ClickListenerContext);

    if (!context) throw new Error('ClickListenerContext is undefined');
    return context;
};
