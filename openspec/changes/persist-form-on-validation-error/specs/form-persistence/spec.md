## ADDED Requirements

### Requirement: Form preserves user input on validation error

Cuando el server action retorna errores de validación, el formulario SHALL preservar todos los valores que el usuario ingresó, permitiendo corregir solo los campos con error sin tener que reescribir todo.

#### Scenario: Validation error preserves all fields
- **WHEN** el usuario completa todos los campos del formulario y presiona "Crear producto"
- **AND** el server action retorna errores de validación (ej: slug inválido)
- **THEN** todos los campos del formulario mantienen los valores que el usuario ingresó
- **AND** los mensajes de error se muestran en los campos correspondientes

#### Scenario: Validation error preserves multi-line fields
- **WHEN** el usuario ingresa múltiples líneas en los campos "Imágenes", "Badges" o "Specs extra"
- **AND** el server action retorna errores de validación
- **THEN** los textareas mantienen todo su contenido original sin perder líneas ni formato

#### Scenario: Validation error preserves checkbox state
- **WHEN** el usuario marca o desmarca los checkboxes "Activo" y "Destacado"
- **AND** el server action retorna errores de validación
- **THEN** los checkboxes mantienen su estado anterior (marcado/desmarcado)

### Requirement: Form preserves user input on server error

Cuando el server action retorna un error genérico (no de validación, ej: error de base de datos), el formulario SHALL preservar los valores ingresados.

#### Scenario: Server error preserves form data
- **WHEN** el usuario envía un formulario con datos válidos
- **AND** el server action retorna un error genérico (ej: error de base de datos)
- **THEN** todos los campos del formulario mantienen sus valores
- **AND** el mensaje de error genérico se muestra en la parte superior del formulario

### Requirement: Form works correctly on successful submission

Cuando el server action retorna éxito, el formulario SHALL redirigir al usuario sin intentar preservar datos.

#### Scenario: Successful creation redirects
- **WHEN** el usuario envía un formulario válido
- **AND** el server action completa exitosamente
- **THEN** el usuario es redirigido a la página de administración con un mensaje de éxito
- **AND** no se produce ningún error ni re-render inesperado

### Requirement: Edit form continues to work correctly

El formulario de edición en `admin/[id]/edit` SHALL continuar funcionando correctamente con los datos del producto existente.

#### Scenario: Edit form loads product data
- **WHEN** el usuario abre la página de edición de un producto existente
- **THEN** todos los campos del formulario se pre-rellenan con los datos del producto
- **AND** si hay errores de validación al guardar, los cambios del usuario se preservan junto con los datos existentes
