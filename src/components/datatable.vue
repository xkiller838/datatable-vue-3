<template>
  <div class="w-full">
    <!-- Search and Filter Section -->
    <div class="mb-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div class="relative w-full sm:w-64">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar..."
          class="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <svg
          class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      
      <div class="flex items-center gap-2">
        <label class="text-sm text-gray-600">Mostrar:</label>
        <select
          v-model="itemsPerPage"
          class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option :value="5">5</option>
          <option :value="10">10</option>
          <option :value="25">25</option>
          <option :value="50">50</option>
        </select>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto custom-scrollbar max-h-[600px] overflow-y-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th
                v-for="column in columns"
                :key="column.key"
                @click="column.sortable !== false && sort(column.key)"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50"
                :class="{ 'cursor-pointer hover:bg-gray-100': column.sortable !== false }"
              >
                <div class="flex items-center gap-2">
                  <span>{{ column.label }}</span>
                  <span v-if="column.sortable !== false && sortKey === column.key" class="text-blue-500">
                    <svg v-if="sortOrder === 'asc'" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                    <svg v-else class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" />
                    </svg>
                  </span>
                </div>
              </th>
              <th v-if="actions" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 sticky top-0">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="(item, index) in paginatedData"
              :key="index"
              class="hover:bg-gray-50 transition-colors"
            >
              <td
                v-for="column in columns"
                :key="column.key"
                class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
              >
                <slot :name="`cell-${column.key}`" :item="item" :value="item[column.key]">
                  {{ item[column.key] }}
                </slot>
              </td>
              <td v-if="actions" class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <slot name="actions" :item="item">
                  <button
                    @click="$emit('edit', item)"
                    class="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    Editar
                  </button>
                  <button
                    @click="$emit('delete', item)"
                    class="text-red-600 hover:text-red-900"
                  >
                    Eliminar
                  </button>
                </slot>
              </td>
            </tr>
            <tr v-if="paginatedData.length === 0">
              <td :colspan="columns.length + (actions ? 1 : 0)" class="px-6 py-8 text-center text-gray-500">
                No se encontraron resultados
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    <div class="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div class="text-sm text-gray-600">
        Mostrando {{ startIndex + 1 }} a {{ Math.min(endIndex, filteredData.length) }} de {{ filteredData.length }} resultados
      </div>
      
      <div class="flex items-center gap-2">
        <button
          @click="currentPage--"
          :disabled="currentPage === 1"
          class="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Anterior
        </button>
        
        <div class="flex gap-1">
          <!-- Primera página -->
          <button
            v-if="totalPages >= 1"
            @click="currentPage = 1"
            :class="[
              'px-3 py-2 text-sm border rounded-lg transition-colors',
              currentPage === 1
                ? 'bg-blue-500 text-white border-blue-500'
                : 'border-gray-300 hover:bg-gray-50'
            ]"
          >
            1
          </button>
          
          <!-- Puntos suspensivos antes del medio -->
          <span v-if="showLeftEllipsis" class="px-2 py-2 text-gray-500">...</span>
          
          <!-- Páginas del medio (alrededor de la actual) -->
          <button
            v-for="page in middlePages"
            :key="`middle-${page}`"
            @click="currentPage = page"
            :class="[
              'px-3 py-2 text-sm border rounded-lg transition-colors',
              currentPage === page
                ? 'bg-blue-500 text-white border-blue-500'
                : 'border-gray-300 hover:bg-gray-50'
            ]"
          >
            {{ page }}
          </button>
          
          <!-- Puntos suspensivos después del medio -->
          <span v-if="showRightEllipsis" class="px-2 py-2 text-gray-500">...</span>
          
          <!-- Última página -->
          <button
            v-if="totalPages > 1"
            @click="currentPage = totalPages"
            :class="[
              'px-3 py-2 text-sm border rounded-lg transition-colors',
              currentPage === totalPages
                ? 'bg-blue-500 text-white border-blue-500'
                : 'border-gray-300 hover:bg-gray-50'
            ]"
          >
            {{ totalPages }}
          </button>
        </div>
        
        <button
          @click="currentPage++"
          :disabled="currentPage === totalPages"
          class="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Siguiente
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  data: {
    type: Array,
    required: true,
    default: () => []
  },
  columns: {
    type: Array,
    required: true,
    // Expected format: [{ key: 'name', label: 'Nombre', sortable: true }]
  },
  actions: {
    type: Boolean,
    default: false
  },
  initialItemsPerPage: {
    type: Number,
    default: 10
  }
})

defineEmits(['edit', 'delete'])

const searchQuery = ref('')
const sortKey = ref('')
const sortOrder = ref('asc')
const currentPage = ref(1)
const itemsPerPage = ref(props.initialItemsPerPage)

// Filtered data based on search
const filteredData = computed(() => {
  if (!searchQuery.value) return props.data
  
  const query = searchQuery.value.toLowerCase()
  return props.data.filter(item => {
    return props.columns.some(column => {
      const value = item[column.key]
      return value && value.toString().toLowerCase().includes(query)
    })
  })
})

// Sorted data
const sortedData = computed(() => {
  if (!sortKey.value) return filteredData.value
  
  return [...filteredData.value].sort((a, b) => {
    const aVal = a[sortKey.value]
    const bVal = b[sortKey.value]
    
    let comparison = 0
    if (aVal > bVal) comparison = 1
    if (aVal < bVal) comparison = -1
    
    return sortOrder.value === 'asc' ? comparison : -comparison
  })
})

// Pagination
const totalPages = computed(() => {
  return Math.ceil(filteredData.value.length / itemsPerPage.value)
})

const startIndex = computed(() => {
  return (currentPage.value - 1) * itemsPerPage.value
})

const endIndex = computed(() => {
  return startIndex.value + itemsPerPage.value
})

const paginatedData = computed(() => {
  return sortedData.value.slice(startIndex.value, endIndex.value)
})

// Lógica de paginación con puntos suspensivos
const middlePages = computed(() => {
  if (totalPages.value <= 3) {
    // Si hay 3 o menos páginas, mostrar todas excepto la primera y última
    const pages = []
    for (let i = 2; i < totalPages.value; i++) {
      pages.push(i)
    }
    return pages
  }
  
  const pages = []
  const current = currentPage.value
  
  // Si la página actual es la primera o última, no mostrar en el medio
  if (current === 1 || current === totalPages.value) {
    return []
  }
  
  // Si estamos cerca del inicio (página 2)
  if (current === 2) {
    pages.push(2)
    return pages
  }
  
  // Si estamos cerca del final (penúltima página)
  if (current === totalPages.value - 1) {
    pages.push(totalPages.value - 1)
    return pages
  }
  
  // Para cualquier otra página, mostrar la actual y una a cada lado
  pages.push(current - 1)
  pages.push(current)
  pages.push(current + 1)
  
  return pages
})

const showLeftEllipsis = computed(() => {
  return totalPages.value > 3 && currentPage.value > 3
})

const showRightEllipsis = computed(() => {
  return totalPages.value > 3 && currentPage.value < totalPages.value - 2
})

// Sort function
const sort = (key) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
}

// Reset to first page when search or items per page changes
watch([searchQuery, itemsPerPage], () => {
  currentPage.value = 1
})
</script>

<style scoped>
/* Scrollbar personalizado naranja brillante */
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #ff6b35;
  border-radius: 4px;
  transition: background 0.3s ease;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #ff5722;
}

/* Para Firefox */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #ff6b35 #f1f5f9;
}
</style>