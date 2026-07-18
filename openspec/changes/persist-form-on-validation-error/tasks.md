## 1. Extend ActionState with values field

- [x] 1.1 Add `values?: Record<string, any>` to the `ActionState` interface in `src/app/admin/actions.ts`

## 2. Return form values on validation error in server actions

- [x] 2.1 In `createProductAction`, when validation fails, extract raw values from FormData and return them inside `values` in the ActionState
- [x] 2.2 In `updateProductAction`, when validation fails, extract raw values from FormData and return them inside `values` in the ActionState
- [x] 2.3 In `createProductAction`, when a DB error occurs (catch block), also return form values in `values`
- [x] 2.4 In `updateProductAction`, when a DB error occurs (catch block), also return form values in `values`

## 3. Convert ProductForm to controlled inputs with local state

- [x] 3.1 Add a `useState` in `ProductForm` to hold form values, initialized from `product` prop (existing behavior)
- [x] 3.2 Add a `useEffect` that syncs `state.values` back into the local state when the action returns with values (error case)
- [x] 3.3 Convert all `<Input>` elements from `defaultValue` to `value` + `onChange`, reading from local state
- [x] 3.4 Convert all `<Textarea>` elements from `defaultValue` to `value` + `onChange`, reading from local state
- [x] 3.5 Convert `<Checkbox>` elements from `defaultChecked` to `checked` + `onChange`, reading from local state

## 4. Verify edit page compatibility

- [x] 4.1 Confirm that `admin/[id]/edit` still pre-populates the form with existing product data
- [x] 4.2 Confirm that editing a product with validation errors preserves both the original product data and the user's changes
