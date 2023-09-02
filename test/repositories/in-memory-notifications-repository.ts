import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository';
import { Notification } from '@/domain/notification/enterprise/entities/notification';

export class InMemoryNotificationRepository implements NotificationsRepository {
  public items: Notification[] = [];

  public async findById(id: string): Promise<Notification | null> {
    const notification = this.items.find((item) => item.id.toString() === id);

    if (!notification) {
      return null;
    }

    return notification;
  }

  public async create(notification: Notification): Promise<void> {
    this.items.push(notification);
  }

  public async save(notification: Notification): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id === notification.id,
    );

    this.items[itemIndex] = notification;
  }
}
