import { Component } from '@angular/core';
import {
  ConfirmEventType,
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';
import { UserService } from 'src/app/services/user/user.service';
import { User, UsersPaginationMetadata } from 'src/app/types/user';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
})
export class UsersComponent {
  users: User[] = [];
  metadata: UsersPaginationMetadata = {
    totalUsers: 0,
    count: 0,
  };
  loading: boolean = false;
  displayAddEditModal = false;
  selectedUser: User | null = null;

  constructor(
    private userService: UserService,
    private confirmService: ConfirmationService,
    private messageService: MessageService
  ) {}

  getUsers($event?: LazyLoadEvent) {
    this.loading = true;
    this.userService
      .getUsers($event?.first || 0, $event?.rows || 10)
      .subscribe((res) => {
        this.users = res.data;
        this.metadata = res.metadata;
        this.loading = false;
      });
  }

  showAddModal() {
    this.displayAddEditModal = true;
    this.selectedUser = null;
  }

  hideAddModal(isClosed: boolean) {
    this.displayAddEditModal = !isClosed;
  }

  refreshTable(newData?: any) {
    this.getUsers();
  }

  showEditModal(user: User) {
    this.displayAddEditModal = true;
    this.selectedUser = user;
  }

  deleteUser(user: User) {
    this.confirmService.confirm({
      message: 'Do you want to delete this user?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.userService.deleteUser(user).subscribe({
          next: (res) => {
            this.refreshTable();
            this.messageService.add({
              severity: 'success',
              summary: 'Confirmed',
              detail: 'User deleted',
            });
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Confirmed',
              detail: 'Failed to delete user.',
            });
          },
        });
      },
      reject: (type: ConfirmEventType) => {},
    });
  }
}
