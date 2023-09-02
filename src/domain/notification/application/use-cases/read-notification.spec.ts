import { InMemoryNotificationRepository } from 'test/repositories/in-memory-notifications-repository';
import { ReadNotificationUseCase } from './read-notification';
import { makeNotification } from 'test/factories/make-notification';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';

let inMemoryNotificationsRepository: InMemoryNotificationRepository;
let sut: ReadNotificationUseCase;

describe('Read Notification', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationRepository();
    sut = new ReadNotificationUseCase(inMemoryNotificationsRepository);
  });

  it('should to be able to read a notification', async () => {
    const notification = makeNotification();

    await inMemoryNotificationsRepository.create(notification);

    const result = await sut.execute({
      recipientId: notification.recipientId.toString(),
      notificationId: notification.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryNotificationsRepository.items[0].readAt).toEqual(
      expect.any(Date)
    );
  });

  it('should not be able to read a notificaiton from another user', async () => {
    const notification = makeNotification({
      recipientId: new UniqueEntityID('recipient-1'),
    });

    await inMemoryNotificationsRepository.create(notification);

    const result = await sut.execute({
      notificationId: notification.id.toString(),
      recipientId: 'recipient-2',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
