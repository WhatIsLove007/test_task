import {ForbiddenError, AuthenticationError} from 'apollo-server-express'

export const checkUserAuthentication = context => {
   if (!context?.user) throw new AuthenticationError('UNAUTHENTICATED');
}

export const checkRole = (context, role) => {
   if (context?.user?.role !== role) {
      throw new ForbiddenError('FORBIDDEN');
   }
}