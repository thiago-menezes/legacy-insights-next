'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Badge, Button, Loader, Table, Text, View } from 'reshaped';
import { Icon } from '@/components/icon';
import { PageTitle } from '@/components/page-title';
import { StrapiProduct } from '@/libs/api/services/products';
import { useProjects } from '../projects/hooks';
import { useSelectedWorkspace } from '../workspaces/context';
import {
  useCreateProductMutation,
  useDeleteProductMutation,
} from './api/mutations';
import { useProductsData } from './hooks';
import { ProductForm } from './product-form';
import { ProductFormData } from './types';

export const Products = () => {
  const { project } = useProjects();
  const {
    selectedOrg,
    currentWorkspaceHasProjects,
    isLoading: isLoadingWorkspace,
  } = useSelectedWorkspace();

  const router = useRouter();

  useEffect(() => {
    if (!isLoadingWorkspace && !currentWorkspaceHasProjects && selectedOrg) {
      router.push(`/workspaces/${selectedOrg.slug}`);
    }
  }, [isLoadingWorkspace, currentWorkspaceHasProjects, selectedOrg, router]);

  const { data, isLoading, handlePageChange } = useProductsData(
    project?.documentId,
  );

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<StrapiProduct | null>(
    null,
  );

  const createMutation = useCreateProductMutation();
  const deleteMutation = useDeleteProductMutation();

  const handleCreate = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleEdit = (product: StrapiProduct) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const handleFormSubmit = async (values: ProductFormData) => {
    if (!project?.documentId) return;

    await createMutation.mutateAsync({
      ...values,
      projectId: project.documentId,
    });
    setIsFormOpen(false);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  const handleViewDetails = (productId: string) => {
    if (selectedOrg && project) {
      router.push(
        `/workspaces/${selectedOrg.slug}/${project.slug}/products/${productId}`,
      );
    }
  };

  if (isLoading || isLoadingWorkspace) {
    return (
      <View align="center" justify="center" paddingTop={10}>
        <Loader />
      </View>
    );
  }

  if (!project) {
    return (
      <View align="center" justify="center" paddingTop={10}>
        <Text>Projeto não encontrado</Text>
      </View>
    );
  }

  const products = data?.data || [];
  const pagination = data?.meta?.pagination;

  return (
    <View>
      <PageTitle
        icon={<Icon name="package" size={32} />}
        title={`Produtos - ${project.name}`}
        description="Gerencie seus produtos digitais e acompanhe vendas via webhooks"
      />

      <View paddingTop={4} gap={4}>
        <View direction="row" justify="space-between" align="center">
          <Text variant="featured-2" weight="medium">
            Lista de Produtos
          </Text>
          <Button onClick={handleCreate}>
            <View direction="row" align="center" gap={2}>
              <Icon name="plus" size={16} />
              Novo Produto
            </View>
          </Button>
        </View>

        {products.length === 0 ? (
          <View
            align="center"
            justify="center"
            paddingTop={10}
            paddingBottom={10}
          >
            <Text color="neutral-faded">
              Nenhum produto cadastrado. Clique em &quot;Novo Produto&quot; para
              começar.
            </Text>
          </View>
        ) : (
          <Table>
            <Table.Head>
              <Table.Row>
                <Table.Cell>Nome</Table.Cell>
                <Table.Cell>Plataforma</Table.Cell>
                <Table.Cell>Preço</Table.Cell>
                <Table.Cell>Status</Table.Cell>
                <Table.Cell>ID Externo</Table.Cell>
                <Table.Cell>Ações</Table.Cell>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {products.map((product) => (
                <Table.Row key={product.id}>
                  <Table.Cell>
                    <Button
                      variant="ghost"
                      onClick={() => handleViewDetails(product.documentId)}
                    >
                      {product.name}
                    </Button>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge color="neutral">{product.platform}</Badge>
                  </Table.Cell>
                  <Table.Cell>
                    {product.price
                      ? `${product.currency || 'BRL'} ${product.price.toFixed(2)}`
                      : '-'}
                  </Table.Cell>
                  <Table.Cell>
                    <Badge color={product.active ? 'positive' : 'neutral'}>
                      {product.active ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>{product.externalId || '-'}</Table.Cell>
                  <Table.Cell>
                    <View direction="row" gap={2}>
                      <Button
                        size="small"
                        variant="ghost"
                        onClick={() => handleEdit(product)}
                      >
                        Editar
                      </Button>
                      <Button
                        size="small"
                        variant="ghost"
                        color="critical"
                        onClick={() => handleDelete(product.documentId)}
                      >
                        Excluir
                      </Button>
                    </View>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}

        {pagination && pagination.pageCount > 1 && (
          <View direction="row" justify="center" gap={2}>
            <Button
              disabled={pagination.page === 1}
              onClick={() => handlePageChange(pagination.page - 1)}
            >
              Anterior
            </Button>
            <Text>
              Página {pagination.page} de {pagination.pageCount}
            </Text>
            <Button
              disabled={pagination.page === pagination.pageCount}
              onClick={() => handlePageChange(pagination.page + 1)}
            >
              Próxima
            </Button>
          </View>
        )}
      </View>

      {isFormOpen && (
        <ProductForm
          isOpen={isFormOpen}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
          initialData={editingProduct}
        />
      )}
    </View>
  );
};
