import linkFiberInitialization from '../routers/linkFiber';
import { Snapshot, Status, FiberRoot } from '../types/backendTypes';
import Tree from '../models/tree';
import { DevTools } from '../types/linkFiberTypes';
import updateAndSendSnapShotTree from '../routers/snapShot';
import throttle from '../controllers/throttle';

describe('linkFiber', () => {
  let snapShot: Snapshot;
  let mode: Status;
  let linkFiber;
  const mockPostMessage = jest.fn();

  beforeEach(() => {
    // Create snapshot and mode objects
    snapShot = {
      tree: new Tree('root', 'root'),
    };
    mode = {
      jumping: false,
      paused: false,
      navigating: undefined,
    };

    linkFiber = linkFiberInitialization(snapShot, mode);
    // Set up mock postMessage function
    window.postMessage = mockPostMessage;

    // Set up mock React DevTools global hook
    (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
      renderers: new Map<1, { version: string }>([[1, { version: '16' }]]),
      inject: jest.fn(),
      supportsFiber: true,
      onCommitFiberRoot: jest.fn(),
      onCommitFiberUnmount: jest.fn(),
      rendererInterfaces: {},
      getFiberRoots: jest.fn(() => [{ current: { tag: 0 } }]),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
    delete window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
  });

  xit('link fiber should return a function', () => {
    expect(typeof linkFiber).toBe('function');
  });

  xit('returned function should not throw an error', () => {
    expect(() => linkFiber()).not.toThrowError();
  });

  xit('should send message to front end that React DevTools is installed', () => {
    linkFiber();
    expect(mockPostMessage).toHaveBeenCalled();
    expect(mockPostMessage).toHaveBeenCalledWith(
      {
        action: 'devToolsInstalled',
        payload: 'devToolsInstalled',
      },
      '*',
    );
  });

  xit('should not do anything if React Devtools is not installed', () => {
    delete window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
    expect(() => linkFiber()).not.toThrowError();
    expect(mockPostMessage).not.toHaveBeenCalled();
  });

  it('should send a message to the front end if the target application is a React App', () => {
    linkFiber();
    // the third call is from the onCommitFiberRoot() function
    expect(mockPostMessage).toHaveBeenCalledTimes(3);
    expect(mockPostMessage).toHaveBeenCalledWith(
      {
        action: 'devToolsInstalled',
        payload: 'devToolsInstalled',
      },
      '*',
    );
    expect(mockPostMessage).toHaveBeenCalledWith(
      {
        action: 'aReactApp',
        payload: 'aReactApp',
      },
      '*',
    );
  });

  xit('should not do anything if the target application is not a React App', () => {});

  xit('should initiate an event listener for visibility change', () => {});
});
