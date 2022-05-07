import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { GestureResponderEvent } from 'react-native';

import { useClickListener } from './ClickListenerContext';

export const useOnClickOutsideComponent = (listenerId: string) => {
    const [clickedInside, setClickedInside] = useState(false);
    const [clickedInsideCount, setClickedInsideCount] = useState(0);

    const ref = useRef();
    const ctxt = useClickListener();
    if (!ctxt) throw new Error('ClickListener is undefined');
    const { addClickListener, rmClickListener } = ctxt;

    const getAllChildrenIds = (element): any[] => {
        const nestedChildren = [];

        nestedChildren.push(element._nativeTag);

        element._children.forEach((child) => {
            if (!!child && !!child._children && child._children.length > 0) nestedChildren.push(...getAllChildrenIds(child));
        });

        return nestedChildren;
    };

    const handleClick = useCallback((e: GestureResponderEvent) => {
      if(ref && ref.current && ref.current._children) {
        console.log('oii');
        console.log(getAllChildrenIds(ref.current));
        console.log('aa')
        // console.log(e.target._nativeTag);
      }
      
        // Clicked
        if (ref && ref.current && ref.current._children && e.target && getAllChildrenIds(ref.current).includes(e.target._nativeTag)) {
            console.log('INSIIIIIIDE');
            registerClickInside();
        }
        // Clicked outside
        else {
            reset();
            console.log('clicked outside');
        }
    }, []);

    useEffect(() => {
        addClickListener(listenerId, handleClick);

        return () => rmClickListener(listenerId);
    }, [addClickListener, handleClick, listenerId, ref, rmClickListener]);

    const registerClickInside = () => {
        setClickedInside(true);
        setClickedInsideCount(clickedInsideCount + 1);
    };

    const reset = () => {
        setClickedInside(false);
        setClickedInsideCount(0);
    };

    return {
        ref,
        clickedInside,
        registerClickInside,
        clickedInsideCount,
        reset,
    };
};