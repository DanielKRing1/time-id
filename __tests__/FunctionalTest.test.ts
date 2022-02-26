import jest from 'jest';

import createTrieTreeNode, { Trie, TrieKV } from '../src';

const ADD_1: TrieKV<any> = {
    key: 'abc',
    value: 'abc',
};

const ADD_2: TrieKV<any> = {
    key: 'abcd',
    value: 'abcd',
};

const ADD_3: TrieKV<any> = {
    key: 'abde',
    value: 'abde',
};

const ADD_4: TrieKV<any> = {
    key: '123',
    value: '123',
};

const ADD_5: TrieKV<any> = {
    key: '1245',
    value: '1245',
};


const trie: Trie<any> = createTrieTreeNode();

describe("Trie", () => {
    it("Should be able to add words to its internal tree", () => {
        try {
            trie.add(ADD_1);
            trie.add(ADD_2);
            trie.add(ADD_3);
            trie.add(ADD_4);
            trie.add(ADD_5);
        }catch(err) {
            fail('it should not reach here');
        }
    });

    it("Should be able to get values from an exact key", () => {
        const actual_1: any[] = trie.getExact(ADD_1.key);
        expect(actual_1).toEqual([ADD_1.value]);

        const actual_2: any[] = trie.getExact(ADD_2.key);
        expect(actual_2).toEqual([ADD_2.value]);

        const actual_4: any[] = trie.getExact(ADD_4.key);
        expect(actual_4).toEqual([ADD_4.value]);

        const actual_5: any[] = trie.getExact(ADD_5.key);
        expect(actual_5).toEqual([ADD_5.value]);
    });

    it("Should be able to get all child values from a key", () => {
        const actual_1: any[] = trie.getAll(ADD_1.key);
        expect(actual_1).toEqual([ADD_1.value, ADD_2.value]);

        const actual_2: any[] = trie.getAll(ADD_2.key);
        expect(actual_2).toEqual([ADD_2.value]);

        const actual_4: any[] = trie.getAll(ADD_4.key);
        expect(actual_4).toEqual([ADD_4.value]);

        const actual_5: any[] = trie.getAll(ADD_5.key);
        expect(actual_5).toEqual([ADD_5.value]);
    });

    it("Should be able to get all child values from a key", () => {
        const actual_1: any[] = trie.getAll(ADD_1.key);
        expect(actual_1).toEqual([ADD_1.value, ADD_2.value]);

        const actual_2: any[] = trie.getAll(ADD_2.key);
        expect(actual_2).toEqual([ADD_2.value]);

        const actual_4: any[] = trie.getAll(ADD_4.key);
        expect(actual_4).toEqual([ADD_4.value]);

        const actual_5: any[] = trie.getAll(ADD_5.key);
        expect(actual_5).toEqual([ADD_5.value]);
    });

    it("Should be able to get exact values from a key", () => {
        const actual_1: any[] = trie.getExact(ADD_1.key);
        expect(actual_1).toEqual([ADD_1.value]);

        const actual_2: any[] = trie.getExact(ADD_2.key);
        expect(actual_2).toEqual([ADD_2.value]);

        const actual_4: any[] = trie.getExact(ADD_4.key);
        expect(actual_4).toEqual([ADD_4.value]);

        const actual_5: any[] = trie.getExact(ADD_5.key);
        expect(actual_5).toEqual([ADD_5.value]);
    });

    
    it("Should be able to prevent duplicate values for a key", () => {
        trie.add(ADD_1);
        trie.add(ADD_2);
        trie.add(ADD_3);
        trie.add(ADD_4);
        trie.add(ADD_5);

        trie.add(ADD_1);
        trie.add(ADD_2);
        trie.add(ADD_3);
        trie.add(ADD_4);
        trie.add(ADD_5);

        trie.add(ADD_1);
        trie.add(ADD_2);
        trie.add(ADD_3);
        trie.add(ADD_4);
        trie.add(ADD_5);
        
        const actual_1: any[] = trie.getExact(ADD_1.key);
        expect(actual_1).toEqual([ADD_1.value]);

        const actual_2: any[] = trie.getExact(ADD_2.key);
        expect(actual_2).toEqual([ADD_2.value]);

        const actual_4: any[] = trie.getExact(ADD_4.key);
        expect(actual_4).toEqual([ADD_4.value]);

        const actual_5: any[] = trie.getExact(ADD_5.key);
        expect(actual_5).toEqual([ADD_5.value]);
    });

    it("Should be able to allow duplicate values for a key", () => {
        const trieWDuplicates: Trie<any> = createTrieTreeNode();

        trieWDuplicates.add(ADD_1);
        trieWDuplicates.add(ADD_2);
        trieWDuplicates.add(ADD_3);
        trieWDuplicates.add(ADD_4);
        trieWDuplicates.add(ADD_5);

        trieWDuplicates.add(ADD_1);
        trieWDuplicates.add(ADD_2);
        trieWDuplicates.add(ADD_3);
        trieWDuplicates.add(ADD_4);
        trieWDuplicates.add(ADD_5);

        trieWDuplicates.add(ADD_1);
        trieWDuplicates.add(ADD_2);
        trieWDuplicates.add(ADD_3);
        trieWDuplicates.add(ADD_4);
        trieWDuplicates.add(ADD_5);
        
        const actual_1: any[] = trieWDuplicates.getExact(ADD_1.key);
        expect(actual_1).toEqual([ADD_1.value]);

        const actual_2: any[] = trieWDuplicates.getExact(ADD_2.key);
        expect(actual_2).toEqual([ADD_2.value]);

        const actual_4: any[] = trieWDuplicates.getExact(ADD_4.key);
        expect(actual_4).toEqual([ADD_4.value]);

        const actual_5: any[] = trieWDuplicates.getExact(ADD_5.key);
        expect(actual_5).toEqual([ADD_5.value]);
    });
});
