# Install
```
npm install rn-click-listener
```
or
```
yarn add rn-click-listener
```

# Features

### Global ContextProvider for managing click events
import { ClickListener } from 'rn-click-listener';\

Wrap your toplevel component in <ClickListener></ClickListener>
to provide a context for managing click events\

### Hook for un/registering click events
```javascript
import { useClickListener } from 'rn-click-listener';

const { addClickListener, rmClickListener } = useClickListener();

const clickHandler = (e: GestureResponderEvent) => {
    console.log(e);
};
const ID = '123';

addClickListener(ID, clickHandler);
rmClickListener(ID);
```

Use 'addClickListener' to add click handlers that will get fired anytime a click is made in the app.\
Don't forget to use 'rmClickListener to unregister the click handlers when your component unmounts

### Hook for detecting clicks inside and outside of a target component
```javascript
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { useOnClickOutsideComponent } from 'rn-click-listener';

const ID = '123';

const Component = (props) => (

    const { ref, clickedInside, clickedInsideCount, registerClickInside, reset } = useOnClickOutsideComponent(ID);

    // Listen for clicks inside/outside of component
    useEffect(() => {
        if(clickedInside) console.log('Clicked inside');
        else console.log('Clicked outside';)
    }, [clickedInside]);

    // Listen for subsequent clicks inside component
    useEffect(() => {
        if(clickedInsideCount > 1) console.log('Clicked inside again');
    }, [clickedInsideCount]);
    
    <View ref={ref}>
      <Text>Hello World</Text>
    </View>
);
```

Use 'useOnClickOutsideComponent' to listen for clicks inside and outside of a component.\
This hook will provide a 'ref' object to assign to the component to listen for.

# Example Usage
```javascript
import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';

import { ClickListener, useOnClickOutsideComponent } from 'rn-click-listener';

export default function App() {

  return (
    <ClickListener>
      <View>

        <Test/>

        <Text>Outside of components</Text>

      </View>
    </ClickListener>
  );
}

const Test = (props) => {

    const { ref, clickedInside, registerClickInside, reset } = useOnClickOutsideComponent('search-bar-test-id');

  return (
    <View ref={ref}>
      <Text>Hello World</Text>
    </View>
  )
};
```