type Dict<T> = Record<string, T>;

type TrieKV<T> = {
    key: string;
    value: T;
};
type Trie<T> = {
    values: T[];
    childTrees: Dict<Trie<T>>;

    add: (keyValue: TrieKV<T>, keyPointer?: number) => boolean;
    rm: (keyValue: TrieKV<T>, keyPointer?: number) => boolean;
    get: (key: string, keyPointer?: number) => T[];

    _hasChildTree: (char: string) => boolean;
    _getAllChildTrees: (parentTree: Trie<T>) => Trie<T>[];
    _dig: (key: string, shouldDigDeeper: (currentTree: Trie<T>, char: string) => boolean, keyPointer?: number) => Trie<T>;
};

function createTrieTreeNode<T>(canHaveDuplicates: boolean = false, isRoot: boolean = false): Trie<T> {
    const values: T[] = [];
    const childTrees: Dict<Trie<T>> = {};

    // PUBLIC API

    const add = (keyValue: TrieKV<T>, keyPointer: number = 0): boolean => {
        const { key, value } = keyValue;

        // 1. Out of bounds, short circuit
        if(keyPointer > key.length) return false;

        // 2. Final char, add value to current tree
        if(keyPointer == key.length) return _addValue(value);

        // 3. Get next letter in the string path
        const char: string = key[keyPointer];

        // 4. Get (and create if necessary) the next child tree in the string path
        const childTree: Trie<T> =_getChildTree(char);
        // 5. Recursively add, incrementing pointer
        return childTree.add(keyValue, keyPointer + 1);
    };

    const rm = (keyValue: TrieKV<T>, keyPointer: number = 0): boolean => {
        const { key, value } = keyValue;

        // 1. Out of bounds, short circuit
        if(keyPointer > key.length) return false;

        // 2. Final char, remove value from current tree
        if(keyPointer == key.length) return _rmValue(value);

        // 3. Get next letter in the string path
        const char: string = key[keyPointer];

        // 4. If does not have child tree for next letter, short circuit
        //      -- If there is no tree, then there is no value to remove
        if(!_hasChildTree(char)) return false;

        // 5. Get the next child tree in the string path, if it was confirmed to exist
        const childTree: Trie<T> =_getChildTree(char);
        // 6. Recursively rm, incrementing pointer
        return childTree.rm(keyValue, keyPointer + 1);
    };

    const get = (key: string, keyPointer: number = 0): T[] => {
        // 1. Out of bounds, short circuit
        if(keyPointer >= key.length) return [];

        // 2. Final char, get all child trees from this root
        if(keyPointer == key.length) {
            const allChildTrees: Trie<T>[] = _getAllChildTrees(thisNode);
            return allChildTrees.reduce((acc: T[], tree: Trie<T>) => {
                acc.concat(tree.values);
                return acc;
            }, []);
        }

        // 3. Get next letter in the string path
        const char: string = key[keyPointer];

        // 4. If does not have child tree for next letter, short circuit
        //      -- If there is no tree, then there is no value to remove
        if(!_hasChildTree(char)) return [];

        // 5. Get the next child tree in the string path, if it was confirmed to exist
        const childTree: Trie<T> =_getChildTree(char);
        // 6. Recursively rm, incrementing pointer
        return childTree.get(key, keyPointer + 1);
    };

    // PRIVATE HELPER API

    const _hasChildTree = (char: string): boolean => !!childTrees[char];

    const _addChildTree = (char: string): boolean => {
        if(!_hasChildTree(char)) {
            childTrees[char] = createTrieTreeNode(false);
            return true;
        }

        return false;
    }

    const _getChildTree = (char: string): Trie<T> => {
        _addChildTree(char);
        return childTrees[char];
    }

    const _getValueIndex = (v: T): number => values.indexOf(v);

    const _hasValue = (v: T): boolean => _getValueIndex(v) != -1;
    
    const _addValue = (v: T): boolean => {
        if(!canHaveDuplicates && _hasValue(v)) return false;

        values.push(v);
        return true;
    }

    const _rmValue = (v: T): boolean => {
        if(_hasValue(v)) {
            const valueIndex: number = _getValueIndex(v);
            values.splice(valueIndex, 1);

            return true;
        }
        
        return false;
    }

    const _dig = (key: string, shouldDigDeeper: (currentTree: Trie<T>, char: string) => boolean, keyPointer: number = 0): Trie<T> => {
        // 1. Out of bounds, short circuit
        if(keyPointer > key.length) return undefined;

        // 2. Final char, remove value from current tree
        // TODO check what 'this' is
        if(keyPointer == key.length) {
            console.log(thisNode);
            return thisNode;
        }

        // 3. Get next letter in the string path
        const char: string = key[keyPointer];

        // 4. If should not dig deeper, short circuit
        console.log(thisNode);
        if(!shouldDigDeeper(thisNode, char)) return undefined;

        // 5. Get the next child tree in the string path, if it was confirmed to exist
        const childTree: Trie<T> =_getChildTree(char);
        // 6. Recursively rm, incrementing pointer
        return childTree._dig(key, shouldDigDeeper, keyPointer + 1);
    }

    const _getAllChildTrees = (parentTree: Trie<T>): Trie<T>[] => {
        console.log(parentTree);

        // 1. Get all child paths to take
        const chars: string[] = Object.keys(childTrees);

        // 2. No more child trees, return empty array
        if(chars.length == 0) return [];

        // 3. Record current level of child trees
        const _childTrees: Trie<T>[] = Object.values(childTrees);
        // 4. Recursively traverse each child path and add each path's set of child trees
        chars.forEach((char: string) => _childTrees.concat(parentTree._getAllChildTrees(childTrees[char])));

        return _childTrees;
    }

    const thisNode: Trie<T> = {
        values,
        childTrees,
        add,
        rm,
        get,
        _dig,
        _hasChildTree,
        _getAllChildTrees,
    }

    return thisNode
};

export default (canHaveDuplicates: boolean) => createTrieTreeNode(canHaveDuplicates, true);

const trie: Trie<any> = createTrieTreeNode(false, true);
trie.add({ key: 'abc', value: 'ABC' });
const childTree: Trie<any> = trie._dig('abc', (currentTree: Trie<any>, char: string) => {
    console.log(currentTree);
    console.log(char);
    console.log(currentTree.values);
    console.log(currentTree.values[char]);

    return true;
});

console.log(childTree);
