<template>
  <div class="p-8 bg-gray-100 min-h-screen">
    <div class="max-w-full mx-auto px-4">
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">
          DataTable con Muchas Columnas e Imágenes
        </h1>
        <p class="text-gray-600">
          Este ejemplo muestra cómo manejar tablas con muchas columnas y columnas con fotos
        </p>
      </div>
      
      <DataTable
        :data="employees"
        :columns="columns"
        :actions="true"
        :initial-items-per-page="10"
        @edit="handleEdit"
        @delete="handleDelete"
      >
        <!-- Slot para la columna de foto -->
        <template #cell-photo="{ value, item }">
          <div class="flex items-center gap-3">
            <img 
              :src="value" 
              :alt="item.name"
              class="w-10 h-10 rounded-full object-cover ring-2 ring-gray-200"
            />
            <span class="font-medium text-gray-900">{{ item.name }}</span>
          </div>
        </template>

        <!-- Slot para email -->
        <template #cell-email="{ value }">
          <a :href="`mailto:${value}`" class="text-blue-600 hover:underline">
            {{ value }}
          </a>
        </template>

        <!-- Slot para el estado -->
        <template #cell-status="{ value }">
          <span
            :class="[
              'px-2 py-1 rounded-full text-xs font-semibold',
              value === 'Activo' ? 'bg-green-100 text-green-800' : 
              value === 'Vacaciones' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            ]"
          >
            {{ value }}
          </span>
        </template>

        <!-- Slot para el salario -->
        <template #cell-salary="{ value }">
          <span class="font-semibold text-green-600">
            ${{ value.toLocaleString() }}
          </span>
        </template>

        <!-- Slot para la fecha de contratación -->
        <template #cell-hireDate="{ value }">
          <span class="text-gray-600">
            {{ new Date(value).toLocaleDateString('es-ES') }}
          </span>
        </template>

        <!-- Slot para el rating -->
        <template #cell-rating="{ value }">
          <div class="flex items-center gap-1">
            <span class="text-yellow-500">★</span>
            <span class="font-medium">{{ value }}</span>
          </div>
        </template>

        <!-- Slot personalizado para las tarjetas -->
        <template #card="{ item }">
          <div class="h-full flex flex-col">
            <!-- Header con foto -->
            <div class="flex items-start gap-4 mb-4">
              <img 
                :src="item.photo" 
                :alt="item.name"
                class="w-16 h-16 rounded-full object-cover ring-4 ring-gray-100"
              />
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900">
                  {{ item.name }}
                </h3>
                <p class="text-sm text-gray-500">{{ item.position }}</p>
                <span
                  :class="[
                    'inline-block mt-2 px-2 py-1 rounded-full text-xs font-semibold',
                    item.status === 'Activo' ? 'bg-green-100 text-green-800' : 
                    item.status === 'Vacaciones' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  ]"
                >
                  {{ item.status }}
                </span>
              </div>
            </div>

            <!-- Información -->
            <div class="space-y-2 flex-1 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-500">Departamento:</span>
                <span class="font-medium">{{ item.department }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">Email:</span>
                <a :href="`mailto:${item.email}`" class="text-blue-600 hover:underline truncate">
                  {{ item.email }}
                </a>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">Teléfono:</span>
                <span class="font-medium">{{ item.phone }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">Ubicación:</span>
                <span class="font-medium">{{ item.location }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">Salario:</span>
                <span class="font-semibold text-green-600">${{ item.salary.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">Rating:</span>
                <span class="font-medium">★ {{ item.rating }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">Fecha Contratación:</span>
                <span class="font-medium">{{ new Date(item.hireDate).toLocaleDateString('es-ES') }}</span>
              </div>
            </div>

            <!-- Acciones -->
            <div class="pt-4 mt-4 border-t border-gray-200 flex gap-2">
              <button
                @click="handleEdit(item)"
                class="flex-1 px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Editar
              </button>
              <button
                @click="handleDelete(item)"
                class="flex-1 px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </template>

        <!-- Acciones para la tabla -->
        <template #actions="{ item }">
          <button
            @click="handleEdit(item)"
            class="text-indigo-600 hover:text-indigo-900 mr-3 font-medium"
          >
            Editar
          </button>
          <button
            @click="handleDelete(item)"
            class="text-red-600 hover:text-red-900 font-medium"
          >
            Eliminar
          </button>
        </template>
      </DataTable>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import DataTable from '@/components/datatableCard.vue'

// Definir columnas - incluyendo muchas columnas para probar scroll horizontal
const columns = [
  { key: 'photo', label: 'Empleado', sortable: false, wrap: false },
  { key: 'id', label: 'ID', sortable: true, wrap: false },
  { key: 'position', label: 'Puesto', sortable: true, wrap: false },
  { key: 'department', label: 'Departamento', sortable: true, wrap: false },
  { key: 'email', label: 'Email', sortable: true, wrap: false },
  { key: 'phone', label: 'Teléfono', sortable: false, wrap: false },
  { key: 'location', label: 'Ubicación', sortable: true, wrap: false },
  { key: 'salary', label: 'Salario', sortable: true, wrap: false },
  { key: 'hireDate', label: 'Fecha Contratación', sortable: true, wrap: false },
  { key: 'rating', label: 'Rating', sortable: true, wrap: false },
  { key: 'status', label: 'Estado', sortable: true, wrap: false }
]

// Generar empleados de ejemplo con fotos usando UI Avatars
const generateEmployees = (count) => {
  const names = ['Juan Pérez', 'María García', 'Carlos Rodríguez', 'Ana Martínez', 'Luis Fernández', 
                 'Carmen López', 'Pedro Sánchez', 'Laura Gómez', 'Miguel Torres', 'Isabel Ruiz',
                 'David Jiménez', 'Sara Moreno', 'José Álvarez', 'Elena Romero', 'Francisco Navarro']
  
  const positions = ['Desarrollador Senior', 'Diseñador UX', 'Project Manager', 'Analista de Datos', 
                     'DevOps Engineer', 'Product Owner', 'Scrum Master', 'QA Engineer', 
                     'Business Analyst', 'Tech Lead']
  
  const departments = ['Tecnología', 'Diseño', 'Producto', 'Marketing', 'Ventas', 'RRHH', 'Finanzas']
  const locations = ['Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Bilbao', 'Málaga']
  const statuses = ['Activo', 'Vacaciones', 'Inactivo']
  
  const employees = []
  
  for (let i = 1; i <= count; i++) {
    const name = names[i % names.length]
    const firstName = name.split(' ')[0]
    const lastName = name.split(' ')[1]
    
    employees.push({
      id: 1000 + i,
      name: name,
      // Usar UI Avatars para generar fotos de perfil
      photo: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=128`,
      position: positions[Math.floor(Math.random() * positions.length)],
      department: departments[Math.floor(Math.random() * departments.length)],
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`,
      phone: `+34 ${Math.floor(Math.random() * 900 + 600)} ${Math.floor(Math.random() * 900000 + 100000)}`,
      location: locations[Math.floor(Math.random() * locations.length)],
      salary: Math.floor(Math.random() * 50000) + 30000,
      hireDate: new Date(2018 + Math.floor(Math.random() * 7), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
      rating: (Math.random() * 2 + 3).toFixed(1),
      status: statuses[Math.floor(Math.random() * statuses.length)]
    })
  }
  
  return employees
}

const employees = ref(generateEmployees(50))

const handleEdit = (item) => {
  console.log('Editar:', item)
  alert(`Editar empleado: ${item.name}`)
}

const handleDelete = (item) => {
  console.log('Eliminar:', item)
  if (confirm(`¿Estás seguro de eliminar a ${item.name}?`)) {
    employees.value = employees.value.filter(e => e.id !== item.id)
  }
}
</script>
