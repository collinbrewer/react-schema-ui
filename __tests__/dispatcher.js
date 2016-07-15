let createMockEditor = (mockReturn) => {
   mockReturn || (mockReturn={});
   return {
      isMounted:jest.fn().mockReturnValue(('isMounted' in mockReturn ? mockReturn.isMounted : true)),
      hasFocus:jest.fn().mockReturnValue(mockReturn.hasFocus || false),
      endEditSession:jest.fn(),
      isEditing:jest.fn().mockReturnValue(mockReturn.isEditing || true)
   };
}

describe('dispatcher', () => {

   let dispatcher;

   beforeEach(() => {
      dispatcher=require('../src/dispatcher.js');
   })

   it('should register staged editor', () => {
      let mockEditor = createMockEditor();
      dispatcher.dispatch({actionType: 'beginEditSession', editor: mockEditor});
      expect(dispatcher.stagedEditors.length).toEqual(1);
   });

   it('should end previous editing session', () => {
      let mockEditor = createMockEditor();
      dispatcher.dispatch({actionType:'beginEditSession', editor: mockEditor});
      dispatcher.dispatch({actionType:'beginEditSession', editor:createMockEditor()});

      expect(mockEditor.endEditSession).toBeCalled();
   });

   it('should unregister staged editors', () => {
      let mockEditor = createMockEditor({isMounted:false});
      dispatcher.dispatch({actionType:'beginEditSession', editor: mockEditor});
      dispatcher.dispatch({actionType:'beginEditSession', editor:createMockEditor()});

      expect(dispatcher.stagedEditors.length).toEqual(1);
   });
});
