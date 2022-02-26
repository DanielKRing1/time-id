type Dict<T> = Record<string, T>;

export type TrieKV<T> = {
    key: string;
    value: T;
};
export type Trie<T> = {
    values: T[];
    childTrees: Dict<Trie<T>>;

    add: (keyValue: TrieKV<T>) => boolean;
    rm: (keyValue: TrieKV<T>) => boolean;
    getExact: (key: string) => T[];
    getAll: (key: string) => T[];

    // _hasChildTree: (char: string) => boolean;
    // _addValue: (v: T) => boolean;
    // _rmValue: (v: T) => boolean;
    // _getAllChildTrees: (parentTree: Trie<T>) => Trie<T>[];
    // _dig: (key: string, shouldDigDeeper: (currentTree: Trie<T>, char: string) => boolean, keyPointer?: number) => Trie<T>;
};

export default function createTrieTreeNode<T>(canHaveDuplicates: boolean = false, isRoot: boolean = false): Trie<T> {
    const values: T[] = [];
    const childTrees: Dict<Trie<T>> = {};

    // PUBLIC API

    const add = (keyValue: TrieKV<T>): boolean => {
        const { key, value } = keyValue;

        // 1. Dig through (and create if necessary) the path of child trees, according to the string path
        const shouldDigDeeper = (currentTree: Trie<T>, char: string) => true;
        const destinationTree: Trie<T> = _dig(thisNode, key, shouldDigDeeper);

        // 2. Add value to destination tree
        return _addValue(destinationTree, value, canHaveDuplicates);
    };

    const rm = (keyValue: TrieKV<T>): boolean => {
        const { key, value } = keyValue;

        // 1.1. If does not have child tree for any point along string path, short circuit
        //      -- If there is no tree, then there is no value to remove
        const shouldDigDeeper = (currentTree: Trie<T>, char: string) => _hasChildTree(currentTree, char);
        // 1.2. Dig through the path of child trees according to the string path
        const destinationTree: Trie<T> = _dig(thisNode, key, shouldDigDeeper);

        // 2. Invalid string path, short circuit
        if(!destinationTree) return false;

        // 3. Remove value from destinaiton tree
        return _rmValue(destinationTree, value);
    };

    const getAll = (key: string): T[] => {
        // 1.1. If does not have child tree for any point along string path, short circuit
        //      -- If there is no tree, then there is no value to remove
        const shouldDigDeeper = (currentTree: Trie<T>, char: string) => _hasChildTree(currentTree, char);
        // 1.2. Dig through the path of child trees according to the string path
        const destinationTree: Trie<T> = _dig(thisNode, key, shouldDigDeeper);

        // 2. Invalid string path, short circuit
        if(!destinationTree) return [];
        
        // 3. Get all child trees from the destination tree
        const allChildTrees: Trie<T>[] = _getAllChildTrees(destinationTree);

        // 4. Return the combined set of values of all child trees
        return allChildTrees.reduce((acc: T[], tree: Trie<T>) => acc.concat(tree.values), destinationTree.values.slice());
    };

    const getExact = (key: string): T[] => {
        // 1.1. If does not have child tree for any point along string path, short circuit
        //      -- If there is no tree, then there is no value to remove
        const shouldDigDeeper = (currentTree: Trie<T>, char: string) => _hasChildTree(currentTree, char);
        // 1.2. Dig through the path of child trees according to the string path
        const destinationTree: Trie<T> = _dig(thisNode, key, shouldDigDeeper);
        
        // 2. Invalid string path, short circuit
        if(!destinationTree) return [];

        // 3. Return the combined set of values of all child trees
        return destinationTree.values;
    };

    const thisNode: Trie<T> = {
        values,
        childTrees,
        add,
        rm,
        getExact,
        getAll,
    }

    return thisNode
};

// PRIVATE HELPER API

function _hasChildTree<T> (treeNode: Trie<T>, char: string): boolean {
    return !!treeNode.childTrees[char];
}

function _addChildTree<T> (treeNode: Trie<T>, char: string): boolean {
    if(!_hasChildTree(treeNode, char)) {
        treeNode.childTrees[char] = createTrieTreeNode(false);
        return true;
    }

    return false;
}

function _getChildTree<T> (treeNode: Trie<T>, char: string): Trie<T> {
    _addChildTree(treeNode, char);
    return treeNode.childTrees[char];
}

function _getValueIndex<T> (treeNode: Trie<T>, v: T): number {
    return treeNode.values.indexOf(v);
}


function _hasValue<T> (treeNode: Trie<T>, v: T): boolean {
    return _getValueIndex(treeNode, v) != -1;
}
    
function _addValue<T> (treeNode: Trie<T>, v: T, canHaveDuplicates: boolean): boolean {
    if(!canHaveDuplicates && _hasValue(treeNode, v)) return false;

    treeNode.values.push(v);
    return true;
}

function _rmValue<T> (treeNode: Trie<T>, v: T): boolean {
    if(_hasValue(treeNode, v)) {
        const valueIndex: number = _getValueIndex(treeNode, v);
        treeNode.values.splice(valueIndex, 1);

        return true;
    }
    
    return false;
}

function _dig<T> (parentTree: Trie<T>, key: string, shouldDigDeeper: (currentTree: Trie<T>, char: string) => boolean, keyPointer: number = 0): Trie<T> {
    // 1. Out of bounds, short circuit
    if(keyPointer > key.length) return undefined;

    // 2. Final char, remove value from current tree
    // TODO check what 'this' is
    if(keyPointer == key.length) return parentTree;

    // 3. Get next letter in the string path
    const char: string = key[keyPointer];

    // 4. If should not dig deeper, short circuit
    if(!shouldDigDeeper(parentTree, char)) return undefined;

    // 5. Get the next child tree in the string path, if it was confirmed to exist
    const childTree: Trie<T> =_getChildTree(parentTree, char);
    // 6. Recursively rm, incrementing pointer
    return _dig(childTree, key, shouldDigDeeper, keyPointer + 1);
}

function _getAllChildTrees<T> (parentTree: Trie<T>): Trie<T>[] {
    // 1. Get all child paths to take
    const chars: string[] = Object.keys(parentTree.childTrees);

    // 2. No more child trees, return empty array
    if(chars.length == 0) return [];

    // 3.1. Record current level of child trees
    // 3.2. Recursively traverse each child path and add each path's set of child trees
    return chars.reduce((acc: Trie<T>[], char: string) => acc.concat(_getAllChildTrees(parentTree.childTrees[char])), Object.values(parentTree.childTrees));
}

const trie: Trie<any> = createTrieTreeNode(false, true);
trie.add({ key: 'abc', value: 'ABC' });
const childTree: Trie<any> = _dig(trie, 'abc', (currentTree: Trie<any>, char: string) => {
    console.log(currentTree);
    console.log(char);
    console.log(currentTree.values);
    console.log(currentTree.values[char]);

    return true;
});

console.log(childTree);
