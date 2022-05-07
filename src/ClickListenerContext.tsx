import React, { FC, useContext, useEffect, useMemo, useState } from 'react';
import { GestureResponderEvent, TouchableWithoutFeedback, View } from 'react-native';

type ClickListenerMap = Record<string, OnClickCallback>;
type OnClickCallback = (e: GestureResponderEvent) => any;
type ClickListenerContextType = {
    clickListeners: ClickListenerMap;
    addClickListener: (id: string, cb: OnClickCallback) => void;
    rmClickListener: (id: string) => void;
};
const ClickListenerContext = React.createContext<ClickListenerContextType | undefined>(undefined);

export const ClickListenerProvider: FC = (props) => {
    const { children } = props;

    const [clickListeners, setClickListeners] = useState<ClickListenerMap>({});

    const addClickListener = React.useCallback(
        (id, cb) => {
            console.log('add');
            console.log(clickListeners);
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
            console.log('execute');

            // console.log(e);
            // console.log(Object.keys(e));
            // console.log(e.target);

            // console.log(listenerCbs);
            // console.log(clickListeners);

            // console.log(Object.keys(clickListeners));
            // console.log(Object.values(clickListeners));

            // console.log('length');
            // console.log(listenerCbs.length);

            for (let i = 0; i < listenerCbs.length; i++) {
                // console.log(i);
                const cb = listenerCbs[i];
                // console.log('cb');
                // console.log(cb);

                // console.log('listenerCbs');
                // console.log(listenerCbs);
                // console.log('keys');
                // console.log(Object.keys(clickListeners));

                // if(cb === null) console.log('null');
                // else if(cb == null) console.log('null')
                // else console.log(cb)

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

// # Usage
// export default function App() {

//   return (
//     <ClickListener>
//       <View style={styles.container}>

//         <Test/>

//         <Text style={styles.paragraph}>
//           Change code in the editor and watch it change on your phone! Save to
//           get a shareable url.
//         </Text>
//         <Card>
//           <AssetExample />
//         </Card>
//       </View>
//     </ClickListener>
//   );
// }

// const Test = (props) => {

//   const { addClickListener, rmClickListener } = React.useContext(
//     ClickListenerContext
//   );

//   const test1 = React.useCallback(() => console.log('calling test method right now'), []);
//   const test2 = React.useCallback(() => console.log('be test method right now'), []);

//   React.useEffect(() => {
//     addClickListener('test', test1);
//     addClickListener('test2', test2);

//     // return () => rmClickListener('test');
//   }, []);

//   return (
//     <View>
//       <Text>Hello World</Text>
//     </View>
//   )
// }