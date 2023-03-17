import {Form, Input, Button} from 'antd';
import {useImmerReducer} from 'use-immer';
import styles from './app.module.css';
import {memo} from 'react';

const addToChildren = (node: any, message: string) => {
  if (node.children) {
    addToChildren(node.children, message);
  } else {
    node.children = {
      id: Math.floor(Math.random() * 100000).toFixed(0),
      message,
    };
    return node;
  }
};
const Card = memo(({tree, type = 'tree'}: any) => {
  console.log('rendered from - ' + type, tree.id);
  if (tree.children) {
    return (
      <>
        <div key={tree.id} className={styles.card}>
          {tree.message}
        </div>
        <Card tree={tree.children} />
      </>
    );
  }
  return (
    <div key={tree.id} className={styles.card}>
      {tree.message}
    </div>
  );
});
const ListCard = memo(({store}: {store: any}) => {
  return (
    <>
      {store.map((item) => (
        <Card key={item.id} tree={item} type="list" />
      ))}
    </>
  );
});
const Demo = () => {
  const [tree, setTree] = useImmerReducer(
    (state, action: any) => {
      const newState = addToChildren(state, action.message);
      return newState;
    },
    {
      children: null,
    }
  );
  const [store, setStore] = useImmerReducer((state, action: any) => {
    state.push({
      id: Math.floor(Math.random() * 100000).toFixed(0),
      message: action.message,
    });
    return state;
  }, []);
  return (
    <>
      <section className={styles.copy}>
        <Form
          onFinish={({message}) => {
            setTree({message});
            setStore({message});
          }}
        >
          <Form.Item name="message">
            <Input />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" type="primary">
              submit
            </Button>
          </Form.Item>
        </Form>
      </section>
      <section className="flex flex-row gap-3">
        <div className='w-1/2'>
          <Card tree={tree} />
        </div>
        <div className='w-1/2'>
          <ListCard store={store} />
        </div>
      </section>
    </>
  );
};
const App = (): JSX.Element => {
  return (
    <main className={styles.main}>
      <Demo />
    </main>
  );
};

export default App;
